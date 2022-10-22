from fastapi import APIRouter

from typing import List, Optional
from fastapi import Body, Depends, Query, UploadFile, File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import Field
from sqlalchemy import false

from api.db.db_config import db, s3
from api.models.user import UserModel
from api.models.user import CurrentUser
from api.services.application import store_documents
from api.services.auth import authHandler
from api.services.user import  update_user_service, get_all_users_service, create_user_service, get_user_service
import json

user = APIRouter()

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

@user.get('/ping')
def ping():
    return 'pong'

@user.post('/register')
async def register(user: UserModel = Body(...), db = Depends(get_db)):
    existing_user = await get_user_service(db, user.userid)
    if existing_user is not None:
        return JSONResponse(status_code=status.HTTP_226_IM_USED, content="User Already Exists")
    user = jsonable_encoder(user)
    created_user = await create_user_service(db, user)
    return created_user

@user.post('/token')
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    _user = await get_user_service(db, int(form_data.username))
    if not _user:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content="User does not exists")
    if _user["verified"] == False:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content="Not Verified User")
    print(_user)
    access_token = authHandler().encode_token(_user['userid'], _user['role'])
    refresh_token = authHandler().encode_refresh_token(_user['userid'])
    return JSONResponse(status_code= status.HTTP_200_OK, content={"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"})

@user.get('/getUser')
async def get_user(db= Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    user = await get_user_service(db, current_user.userid)
    return user

@user.get('/getUserById')
async def get_user_by_id(id = Query(...), db= Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    if current_user.claims == 'admin' or current_user.claims == 'tpc' or current_user.claims == 'tpo':
        users = await get_user_service(db, int(id))
        return users
    return 'Not Admin'

@user.get('/getAllUser')
async def get_all_users(db= Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    if current_user.claims == 'admin' or current_user.claims == 'tpc' or current_user.claims == 'tpo':
        users = await get_all_users_service(db)
        return users
    return 'Not Admin'

@user.patch('/updateUser')
async def update_user(
        password: Optional[str] = Query(None),
        email: Optional[str] = Query(None),
        db = Depends(get_db),
        current_user: CurrentUser = Depends(get_current_user)
    ):
        
    user = {}
    if password is not None:
        user['password'] = password
    if email is not None:
        user['email'] = email    
    update_user = await update_user_service(db, current_user.userid, user)
    return update_user