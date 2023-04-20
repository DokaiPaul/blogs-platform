import {ObjectId} from "mongodb";

export type CommentViewModel=
    {
        id?: string,
        _id?: ObjectId,
        content: string,
        commentatorInfo: CommentatorInfo,
        createdAt: string
    }

type CommentatorInfo =
    {
        userId: string,
        userLogin: string
    }

