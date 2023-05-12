import {ObjectId} from "mongodb";

export type ActiveSessionDbModel =
    {
        _id?: ObjectId
        ip: string,
        title: string,
        lastActiveDate: string,
        tokenExpirationDate?: string,
        deviceId: string,
        userId: string,

    }