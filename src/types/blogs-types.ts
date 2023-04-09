export type BlogsType =
    {
        id?: string,
        _id?: string,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: string,
        isMembership: boolean
    }

export type BlogInputType =
    {
        name: string,
        description: string,
        websiteUrl: string,
    }
