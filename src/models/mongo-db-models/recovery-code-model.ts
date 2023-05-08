import {ObjectId} from "mongodb";

export type RecoveryCodeModel = {
    _id?: ObjectId,
    email: string,
    confirmationCode: string,
    isUsed: boolean,
    creationDate: Date
}