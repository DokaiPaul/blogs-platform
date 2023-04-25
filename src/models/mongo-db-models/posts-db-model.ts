import {ObjectId} from "mongodb";

export type PostsDbModel = {
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId | string,
    blogName: string,
    createdAt: string
}