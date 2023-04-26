import {client} from "../database/mongo-db";
import {DeletedObject, InsertedObject} from "../models/additional-types/mongo-db-types";
import {ObjectId} from "mongodb";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";


const usersCollection = client.db('bloggers-platform').collection<UserDbModel>('users')

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findByConfirmationCode (code: string): Promise<UserDbModel | null>{
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        if(!user) return null

        return user
    },
    async updateConfirmationStatus (id: string): Promise<boolean> {
        const user = await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.isConfirmed': true}})

        return user.matchedCount === 1
    },
    async updateConfirmationCode (id: string, code: string): Promise<boolean> {
        const user = await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.confirmationCode': code}})

        return user.matchedCount === 1
    },
    async createUser (user: UserDbModel): Promise<InsertedObject> {
        return await usersCollection.insertOne(user)
    },
    async deleteUser (id: string): Promise<DeletedObject> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    }
}