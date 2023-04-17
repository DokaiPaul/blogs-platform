import {ObjectId} from "mongodb";

export type BlogsType =
    {
        id?: string,
        _id?: ObjectId,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: string,
        isMembership: boolean
    }