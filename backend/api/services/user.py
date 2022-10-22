
async def create_user_service(db, user):
    new_user = await db["users"].insert_one(user)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    return created_user

async def update_user_service(db, userid, user):
    update_result = await db["users"].update_one({"userid": userid}, {"$set": user})
    if update_result.modified_count == 1:
        update_user = await db["users"].find_one({"userid": userid})
        if update_user is not None:
            return update_user
    return None

async def get_user_service(db, userid):
    user = await db["users"].find_one({"userid": userid})
    return user

async def get_all_users_service(db):
    users = await db["users"].find().to_list(1000)
    return users