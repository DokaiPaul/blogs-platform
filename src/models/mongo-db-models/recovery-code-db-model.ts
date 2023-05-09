import {ObjectId} from "mongodb";

export type RecoveryCodeDbModel = {
    _id?: ObjectId,
    email: string,
    confirmationCode: string,
    isUsed: boolean,
    creationDate: Date
}