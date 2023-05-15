import {ObjectId} from "mongodb";
import {StatusData} from "./comments-db-model";

export type PostsDbModel = {
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId | string,
    blogName: string,
    createdAt: string,
    likes: StatusData[],
    dislikes: StatusData[]
}