from typing import Optional
from api.models.objectid import PyObjectId
from bson import ObjectId
from pydantic import BaseModel, Field

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    userid: int = Field(...)
    name: str = Field(...)
    dob: str = Field(...)
    gender:str = Field(...)
    phone: int = Field(...)
    password: str = Field(...)
    email: str = Field(...)
    branch: str = Field(...)
    joining: int = Field(...)
    role: str = Field(...)
    verified: bool = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "userid": 9999,
                "name": "Jane Doe",
                "dob": "27/10/2000",
                "gender": "male",
                "phone": "9876543210",
                "password": "janedoe",
                "email": "jdoe@example.com",
                "branch": "Computer",
                "joining": 2019,
                "role": "student",
                "verified": False,
            }
        }

class UserLoginModel(BaseModel):
    userid: int = Field(...)
    password: int = Field(...)

class CurrentUser(BaseModel):
    userid: int = Field(...)
    name: str = Field(...)
    access_token: str = None
    claims: str = Field(...)