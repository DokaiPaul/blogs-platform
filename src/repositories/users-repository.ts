import {client} from "../database/mongo-db";
import {UsersType} from "../models/view-models/users-view-model";
import {CreateNewUser, DeletedObject, InsertedObject} from "../models/additional-types/mongo-db-types";
import {ObjectId} from "mongodb";


const usersCollection = client.db('bloggers-platform').collection<CreateNewUser>('users')

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<CreateNewUser | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async createUser (user: CreateNewUser): Promise<InsertedObject> {
        return await usersCollection.insertOne(user)
    },
    async deleteUser (id: string): Promise<DeletedObject> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    }
}