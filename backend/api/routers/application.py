from fastapi import APIRouter


from typing import Dict, Optional, List
from django.http import FileResponse
from fastapi import APIRouter, Body, Depends, File, Form, Query, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import Field
from datetime import date, datetime, timedelta

from api.db.db_config import db, s3

from api.models.user import  CurrentUser
from api.services.auth import authHandler
from api.services.user import get_user_service
from api.models.application import ApplicationModel
from api.services.application import create_application_service
from api.services.application import store_documents
from api.services.application import update_application_service, get_application_by_id_service
from api.services.application import create_application_service, get_all_applications_service, store_document
from api.services.application import update_application_service, get_application_by_id_service, get_application_by_user_service

application = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    yield db

def get_s3():
    yield s3

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = authHandler().decode_access_token(token)
    userid: str = payload.get("sub")
    claims = payload.get("claims")
    if userid is None:    
        raise credentials_exception
    user = await get_user_service(db, userid)
    if user is None:
        raise credentials_exception
    access_token = payload.get("access_token")
    return CurrentUser(userid=user['userid'], name=user['name'], access_token=access_token, claims=claims)

@application.post('/newApplication')
async def new_application(
        requiredDocumentsFile: List[UploadFile] = File(...), 
        requiredDocumentsName: List[str] = Form(...),
        comment : str = Form(...),
        copies: str = Form(...),
        cgpa: str = Form(...),
        db = Depends(get_db),
        s3 = Depends(get_s3),
        current_user: CurrentUser = Depends(get_current_user)
    ):
    x = requiredDocumentsName[0].split(",")
    urls = await store_documents(s3, requiredDocumentsFile)
    requiredDocuments = {x[i]: urls[i] for i in range(len(x))}
    application = jsonable_encoder(
        ApplicationModel(
            userid = current_user.userid,
            tpcStatus = "In Progress",
            tpoStatus = "In Progress",
            requiredDocments = requiredDocuments,
            copies = copies,
            issued = False,
            dateOfApplication = datetime.today(),
            cgpa = cgpa,
            comment = comment
        ))
    created_application = await create_application_service(db, application)
    return 
    
@application.post('/changeStatus/{id}')
async def change_application_status(
        id = Query(...),
        status = Query(...),
        comment = Query(None),
        db = Depends(get_db),
        current_user: CurrentUser = Depends(get_current_user)
    ):

    if current_user.claims == 'tpc':
        application = {}
        application['tpcStatus'] = status
        if comment is not None:
            application['comment'] = comment
        if status == 'Approved':
            appl = await get_application_by_id_service(db, id)
            user = await get_user_service(db, int(appl['userid']))
            #send notif
        update_application = await update_application_service(db, id, application)
        return update_application

    if current_user.claims == 'tpo':
        application = {}
        application['tpoStatus'] = status
        application['issued'] = False
        if comment is not None:
            application['comment'] = comment
        if status == 'Approved':
            appl = await get_application_by_id_service(db, id)
            user = await get_user_service(db, int(appl['userid']))
            #send notif
        update_application = await update_application_service(db, id, application)
        return update_application

    if current_user.claims == 'admin':
        application = {}
        if status == "Issued":
            application['issued'] = True
        if comment is not None:
            application['comment'] = comment
        if status == 'Issued':
            appl = await get_application_by_id_service(db, id)
            if appl['issued'] != True:
                application['dateOfIssue'] = datetime.today()
            user = await get_user_service(db, int(appl['userid']))
            #send notif
        update_application = await update_application_service(db, id, application)
        return update_application

    return 'No admin priveleges'

@application.get('/getApplicationById/{id}')
async def get_application_by_id(
        id = Query(...),
        db = Depends(get_db),
        current_user: CurrentUser = Depends(get_current_user)
    ):
    application = await get_application_by_id_service(db, id)
    return application


@application.get('/getApplicationByUser')
async def get_application_by_user(
        userid: int = Query(...),
        db = Depends(get_db),
        current_user: CurrentUser = Depends(get_current_user)
    ):
    application = await get_application_by_user_service(db, userid)
    return application

@application.patch('/feeUpdate/{id}')
async def fee_update_application(
        id = Field(...),
        feeProof: UploadFile = File(None), 
        comment : Optional[str] = Form(None),
        db = Depends(get_db),
        s3 = Depends(get_s3),
        current_user: CurrentUser = Depends(get_current_user)
    ):
        
    application = {}
    if feeProof is not None:
        url = await store_document(s3, feeProof)
        application['feeProof'] = url
    if comment is not None:
        application['comment'] = comment

    update_application = await update_application_service(db, id, application)
    return update_application

@application.get('/getAllApplications')
async def get_all_applications(
        db = Depends(get_db),
        current_user: CurrentUser = Depends(get_current_user)
    ):
    if current_user.claims == 'tpc' or current_user.claims == 'tpo' or current_user.claims == 'admin':
        applications = await get_all_applications_service(db)
        return applications
    return 'No admin priveleges'
