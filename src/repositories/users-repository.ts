import {DeletedObject} from "../models/additional-types/mongo-db-types";
import {ObjectId} from "mongodb";
import {UserDbModel} from "../models/mongo-db-models/users-db-model";
import {RecoveryCodeDbModel} from "../models/mongo-db-models/recovery-code-db-model";
import {UserModel} from "../database/models/user-model";
import {RecoveryCodeModel} from "../database/models/recovery-code-model";


export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbModel | null> {
        return UserModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]}).select('-__v').lean()
    },
    //todo add type for function return
    async findByLogin(login: string) {
        return UserModel.findOne({login: login}).select('-__v').lean()
    },
    //todo add type for function return
    async findByEmail(email: string) {
        return UserModel.findOne({email: email}).select('-__v').lean()
    },
    async findByConfirmationCode (code: string): Promise<UserDbModel | null>{
        const user = UserModel.findOne({'emailConfirmation.confirmationCode': code}).select('-__v').lean()

        if(!user) return null

        return user
    },
    async updateConfirmationStatus (id: string): Promise<boolean> {
        const user = await UserModel.updateOne({_id: new ObjectId(id)}, {'emailConfirmation.isConfirmed': true})

        return user.matchedCount === 1
    },
    async updateConfirmationCode (id: string, code: string): Promise<boolean> {
        const user = await UserModel.updateOne({_id: new ObjectId(id)}, {'emailConfirmation.confirmationCode': code})

        return user.matchedCount === 1
    },
    //todo add type for function return
    async createUser (user: UserDbModel) {
        return await UserModel.create(user)
    },
    async deleteUser (id: string): Promise<DeletedObject> {
        return  UserModel.deleteOne({_id: new ObjectId(id)})
    },
    //todo add type for function return
    async createRecoveryConfirmationCode (recoveryCode: RecoveryCodeDbModel) {
        return RecoveryCodeModel.create(recoveryCode)
    },
    async findRecoveryConfirmationCode (recoveryCode: string): Promise<RecoveryCodeDbModel | null> {
        return RecoveryCodeModel.findOne({confirmationCode: recoveryCode}).select('-__v').lean()
    },
    //todo add type for function return
    async changeRecoveryCodeStatus (id: ObjectId) {
        return RecoveryCodeModel.updateOne({_id: id}, {isUsed: true})
    },
    //todo add type for function return
    async updatePassword (email: string, hash: string) {
        return UserModel.updateOne({email: email}, {passwordHash: hash})
    }
}