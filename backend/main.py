from fastapi import FastAPI
import uvicorn

from api.routers.user import user
from api.routers.application import application
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(openapi_url="/api/v1/openapi.json", docs_url="/api/v1/docs")

origins = [

    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:4200"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(user, prefix='/api/v1', tags=['user'])

app.include_router(application, prefix='/api/v1', tags=['application'])

if __name__ == '__main__':
    uvicorn.run('main:app',reload=True, port=8000)