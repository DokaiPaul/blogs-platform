export type CommentViewModel=
    {
        id?: string,
        content: string,
        commentatorInfo: CommentatorInfo,
        likesInfo: LikesInfo,
        createdAt: string
        postId?: string,
        likes?: {userId: string, date: Date}[],
        dislikes?: {userId: string, date: Date}[]
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