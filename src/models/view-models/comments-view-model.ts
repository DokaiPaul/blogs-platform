import {StatusData} from "../mongo-db-models/comments-db-model";

export type CommentViewModel=
    {
        id?: string,
        content: string,
        commentatorInfo: CommentatorInfo,
        likesInfo: LikesInfo,
        createdAt: string
        postId?: string,
        likes?: StatusData[],
        dislikes?: StatusData[]
    }

export type CommentatorInfo =
    {
        userId: string,
        userLogin: string
    }

export type LikesInfo =
    {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus
    }

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}