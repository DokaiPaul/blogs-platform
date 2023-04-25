import {client} from "../database/mongo-db";
import {DeletedObject, InsertedObject} from "../models/additional-types/mongo-db-types";
import {ObjectId} from "mongodb";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";


const usersCollection = client.db('bloggers-platform').collection<UserDbModel>('users')

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async createUser (user: UserDbModel): Promise<InsertedObject> {
        return await usersCollection.insertOne(user)
    },
    async deleteUser (id: string): Promise<DeletedObject> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    }
}