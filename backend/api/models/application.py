from datetime import date
from enum import IntEnum
from bson import ObjectId

from typing import List, Optional, Dict
from fastapi import File
from pydantic import BaseModel, Field
from sqlalchemy import Date

from api.models.objectid import PyObjectId

class ApplicationModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    userid : int = Field(...)
    tpcStatus : str = Field(...)
    tpoStatus : str = Field(...)
    requiredDocments: Dict[str, str] = Field(...)
    dateOfApplication: date = Field(...)
    copies: int = Field(...)
    cgpa: float = Field(...)
    issued: bool = Field(...)
    comment : Optional[str] = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jdoe@example.com",
            }
        }   

class UpdateApplicationModel(BaseModel):
    requiredDocments: Optional[Dict[str, str]]
    comment : Optional[str]
