import {ObjectId} from "mongodb";
import {CommentatorInfo, LikesInfo} from "../view-models/comments-view-model";

export type CommentsDbModel =
    {
        _id?: ObjectId,
        content: string,
        commentatorInfo: CommentatorInfo,
        likes: {userId: string, date: Date}[],
        dislikes: {userId: string, date: Date}[],
        createdAt: string,
        postId?: string,
        likesInfo?: LikesInfo
    }