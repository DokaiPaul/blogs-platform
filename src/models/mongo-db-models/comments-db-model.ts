import {ObjectId} from "mongodb";
import {CommentatorInfo, LikesInfo} from "../view-models/comments-view-model";

export type CommentsDbModel =
    {
        _id?: ObjectId,
        content: string,
        commentatorInfo: CommentatorInfo,
        likes: StatusData[],
        dislikes: StatusData[],
        createdAt: string,
        postId?: string,
        likesInfo?: LikesInfo
    }

export type StatusData = {
        userId: string,
        addedAt: string,
        login?: string
    }