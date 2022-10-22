import motor.motor_asyncio
import boto3
from botocore.client import Config

client = motor.motor_asyncio.AsyncIOMotorClient('') #Change to mongo connection string url

db = client.transcripts

s3 = boto3.client(
    's3',
    aws_access_key_id='', #AWS Access Key ID Here
    aws_secret_access_key='', #AWS Secret Access Key
    config= Config(signature_version='s3v4')
)