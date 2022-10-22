from pydoc import doc
from bson import json_util
import cryptography
import json
from jose import jws
from jose import jwt
from datetime import datetime, timedelta
from decimal import Decimal
from jose.exceptions import JWSError
from fastapi import HTTPException, Security, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from passlib.hash import sha256_crypt

class authHandler():
    security = HTTPBearer()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    algorithm = 'RS512'

    private_key = '''
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA5/2fYhjBQ7VOa9KEfo9vh43K7I48h5wOp/05EQHldocWjv9Q
d/YHyba7cEw+LHl7iKi+hOzswf0JCE1LCr7zijw1bVy25NRDG5YuoQWrRzT/Ygt4
UYl+ehdj4s5fZdti6utkTsuUDHyEGVXrDmjs4uUv4oQjq1wxUeh2WogU3C1dnGFd
oW01rGFwAwDALa9IdUJNqYeS+rRho6JMx1tj1PA4zAaycAeMVwa0YRSSppwqxNtZ
B0/f9C+ZWid+TawUOQbJTOwlDZQHoPcqU18l8WqYts34KCAU+dKXFQIyo12El3ID
NW/n+yw0S1xxhGPpbxwPhs0J1vNoLCYwHKmIaQIDAQABAoIBAFBBXTICfll+D3Md
kNh3po2ub9UGH8qKIkfbQjKwBUHL2fH+QUg+xNLzdESVG60nGaVdOwuhKwaxEr7c
fmlpRbc8vP7oZB0lkVGp0tfBrk8j9nVkomsStb5m+RctbbM/Aili5YCczMrFCK37
GyYRBmI4ByjFrdFKQ4Widc875HuGTWmFTguLi2xR6rSDGudwiLX95p8ywqHplx/F
vg1B1/IgAQ3vr8N0gyLpHmM/ctUvqPh/kKqMA1eyOCAeLXcvq2OpMs0B3QZX+Cof
JPu2fDEHfRPx/GqC5D+zHnSb+yPFA7+iQq2A9MXBWTNhLAyBCzFIYiaENwC9hN9t
vxTgl0ECgYEA/glp7MlwKxxPfpCfTp28aj9DoxQ88qIB4O09YoJ0GIs2t81IgCvI
KHRIKXUNZBT7T+vDx0SnUAUD9ACRLsRgESZHoJ+RlzieSFqOOavCyBMF0/Ng6Gv1
I2sd4rtiICSojmWO7X7WPTEYjztYq8ljfNFkn8gSr1PqDU/IQRkRTH8CgYEA6ciX
yNEyE95TzlNUzcMgwTsozJSkwbdoVCnfnDBPHeWMHxlKx0dFRxOQ0fa2LRI7hgZX
mfTrnLgvn1yWVoWJDBGcZgha+5UhH4uFfrbWc3amu2uiWmN4SBDhh6OUVPtc5Mx3
kGLpfqG4Paty4wYwwVIorHXZRmb7j6YjamCj1xcCgYEAwQ9KbueP1VOInnkueMKr
hFtb/b3Nq9+vac8iTZEyxcxW40yhgrbDQOtORCNu79Z6P3y/ptroBIorPO6JZ29a
Su46lTlvnesrb3VSjUWZnA/I6BEYXspc3HP1nHAn3KG/b6iC/L7d9lcvgPrrInLE
pwFDZaLZgGFXiJJPcBmq6eUCgYBj5yql0G/b+bhKhWXKAEaxDHzk3+iAN8ZHoRVD
g4lrtzpn18ES46wBMaVDdHBpVk9FeNRaoEVHVZZUPZapJqtoEuaI2601sYbUGiVT
/wIpmVyq3tYkVjmCYmReOFMc9cW+qHm3o+0wBh/biravuWeAVYG4ISxWX4/E1TRx
MxcQxQKBgQDiHMw/FNoMdbf5uBRB2UgCWZ/uIewQjOm5QJOyW4wcxeSHpQjTpA2Z
nlZbJmQyPCsI+XjRau62L9HIcCdcoibkRbAILbgR2zCOxdpKpUr5v5zMj7s7uawy
LRZGwqpBb5M+YSAjwk9l4tNpOXqDmZkIBRP5uGyix21K09OiuZZ8yg==
-----END RSA PRIVATE KEY-----
    '''
    public_key = '''
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5/2fYhjBQ7VOa9KEfo9v
h43K7I48h5wOp/05EQHldocWjv9Qd/YHyba7cEw+LHl7iKi+hOzswf0JCE1LCr7z
ijw1bVy25NRDG5YuoQWrRzT/Ygt4UYl+ehdj4s5fZdti6utkTsuUDHyEGVXrDmjs
4uUv4oQjq1wxUeh2WogU3C1dnGFdoW01rGFwAwDALa9IdUJNqYeS+rRho6JMx1tj
1PA4zAaycAeMVwa0YRSSppwqxNtZB0/f9C+ZWid+TawUOQbJTOwlDZQHoPcqU18l
8WqYts34KCAU+dKXFQIyo12El3IDNW/n+yw0S1xxhGPpbxwPhs0J1vNoLCYwHKmI
aQIDAQAB
-----END PUBLIC KEY-----
    '''

    def defaultconverter(o):
        if isinstance(o, datetime.datetime):
            return o.__str__()

    def get_pwd_hash(self, pwd):
        return sha256_crypt.hash(pwd)

    def verify_pwd(self, plain_pwd, hashed_pwd):
        return sha256_crypt.verify(plain_pwd, hashed_pwd)

    def encode_token(self, user_id, role):
        payload = {
            'exp': int((datetime.utcnow() + timedelta(days=5)).timestamp()),
            'iat': int(datetime.utcnow().timestamp()),
            'sub': user_id,
            'claims': role
        }
        return jws.sign(payload,self.private_key,algorithm=self.algorithm)

    def encode_refresh_token(self, user_id):
        payload = {
            'exp': int((datetime.utcnow() + timedelta(days=5)).timestamp()),
            'iat': int(datetime.utcnow().timestamp()),
            'sub': user_id,
        }
        return jws.sign(payload,self.private_key,algorithm=self.algorithm)

    def encrypt_documents(self, fetchedDocuments):
        encrypts = []
        for document in fetchedDocuments:
            document = json.dumps(document, default=json_util.default)
            encrypts.append(jws.sign(document.encode(), self.private_key, algorithm=self.algorithm))
        return json.dumps(encrypts, default=json_util.default)

    def decode_refresh_token(self, token):
        """
        Decode the refresh token for the user
        """
        try:
            payload = jws.verify(token, self.public_key, algorithms=self.algorithm)
            payload = json.loads(payload.decode("utf-8").replace("'",'"'))
            if payload['exp'] < int(datetime.utcnow().timestamp()):
                return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content='Refresh Token has Expired')
            return payload
        except JWSError as e:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content='Invalid JWT')

    def decode_token(self, token):
        """
        Decode the refresh token for the user
        """
        try:
            payload = jws.verify(token, self.public_key, algorithms=self.algorithm)
            payload = json.loads(payload.decode("utf-8").replace("'",'"'))
            return payload
        except JWSError as e:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content='Invalid JWT')

    def decode_access_token(self, token):
        """
        Decode the access token for the user
        """
        try:
            payload = jws.verify(token, self.public_key, algorithms=self.algorithm)
            payload = json.loads(payload.decode("utf-8").replace("'",'"'))
            #If the token expires then get the refresh token of the user and regenerate the access token
            if payload['exp'] < int(datetime.utcnow().timestamp()):
                return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content='Access Token has Expired')
            return payload
        except JWSError as e:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content='Invalid JWT')

    def auth_wrapper(self, auth: HTTPAuthorizationCredentials = Security(security)):
        return self.decode_token(auth.credentials)
