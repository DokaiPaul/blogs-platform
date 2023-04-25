import {ObjectId} from "mongodb";

export type PostsType = {
    id?: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId | string,
    blogName: string,
    createdAt: string
}