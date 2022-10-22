
async def store_documents(s3, requiredDocuments):
    urls = []
    for document in requiredDocuments:
        s3.upload_fileobj(document.file, 'digitalpirates2022', document.filename)
        url = s3.generate_presigned_url('get_object',
                                                    Params={'Bucket': 'digitalpirates2022',
                                                            'Key': document.filename},
                                                    ExpiresIn=604799)
        urls.append(url)
    return urls

async def store_document(s3, requiredDocuments):
    s3.upload_fileobj(requiredDocuments.file, 'digitalpirates2022', requiredDocuments.filename)
    url = s3.generate_presigned_url('get_object',
                                                Params={'Bucket': 'digitalpirates2022',
                                                        'Key': requiredDocuments.filename},
                                                ExpiresIn=604799)
    return url

async def create_application_service(db, application):
    new_application = await db["applications"].insert_one(application)
    created_application = await db["applications"].find_one({"_id": new_application.inserted_id})
    return created_application

async def update_application_service(db, id, application):
    update_result = await db["applications"].update_one({"_id": id}, {"$set": application})
    if update_result.modified_count == 1:
        update_application = await db["applications"].find_one({"_id": id})
        if update_application is not None:
                return update_application
    return None
    
async def get_application_by_id_service(db, id):
    application = await db["applications"].find_one({"_id": id})
    return application

async def get_application_by_user_service(db, userid):
    application = await db["applications"].find({"userid": userid}).to_list(1000)
    return application