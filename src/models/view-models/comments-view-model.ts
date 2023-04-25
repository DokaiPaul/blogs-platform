export type CommentViewModel=
    {
        id?: string,
        content: string,
        commentatorInfo: CommentatorInfo,
        createdAt: string
        postId?: string
    }

export type CommentatorInfo =
    {
        userId: string,
        userLogin: string
    }


