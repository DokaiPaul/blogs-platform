import {ObjectId} from "mongodb";

export type UserDbModel =
    {
        _id?: ObjectId,
        login: string,
        passwordHash: string,
        passwordSalt: string,
        email: string,
        createdAt: Date
    }