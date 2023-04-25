import {ObjectId} from "mongodb";
import {CommentatorInfo} from "../view-models/comments-view-model";

export type CommentsDbModel =
    {
        _id?: ObjectId,
        content: string,
        commentatorInfo: CommentatorInfo,
        createdAt: string,
        postId: string
    }