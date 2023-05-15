import {ObjectId} from "mongodb";
import {LikeStatus} from "./comments-view-model";
import {StatusData} from "../mongo-db-models/comments-db-model";

export type PostsType = {
    likes?: StatusData[],
    dislikes?: StatusData[],
    id?: string,
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId | string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}

type ExtendedLikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: StatusData[]
}