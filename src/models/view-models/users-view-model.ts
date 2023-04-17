import {ObjectId} from "mongodb";

export type UsersType =
    {
        id?: string,
        _id?: ObjectId
        login: string,
        email: string,
        createdAt: Date | string
    }