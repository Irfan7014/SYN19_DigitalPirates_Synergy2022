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
        copies: int = Form(...),
        cgpa: float = Form(...),
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
    return created_application