import {client} from "../database/mongo-db";
import {DeletedObject, InsertedObject} from "../models/additional-types/mongo-db-types";
import {ObjectId} from "mongodb";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";
import {RecoveryCodeModel} from "../models/mongo-db-models/recovery-code-model";


const usersCollection = client.db('bloggers-platform').collection<UserDbModel>('users')
const recoveryPassCodes = client.db('bloggers-platform').collection<RecoveryCodeModel>('recovery-codes')

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findByLogin(login: string) {
        return await usersCollection.findOne({login: login})
    },
    async findByEmail(email: string) {
        return await usersCollection.findOne({email: email})
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
    },
    async createRecoveryConfirmationCode (recoveryCode: RecoveryCodeModel) {
        return await recoveryPassCodes.insertOne(recoveryCode)
    },
    async findRecoveryConfirmationCode (recoveryCode: string) {
        return await recoveryPassCodes.findOne({confirmationCode: recoveryCode})
    },
    async changeRecoveryCodeStatus (id: string) {
        return await recoveryPassCodes.updateOne({_id: new ObjectId(id)}, {$set: {isUsed: true}})
    },
    async updatePassword (email: string, hash: string) {
        return await usersCollection.updateOne({email: email}, {$set: {passwordHash: hash}})
    }
}