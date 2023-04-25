export type UsersViewModel =
    {
        id?: string,
        login: string,
        email: string,
        createdAt: Date | string,
        passwordSalt?: string,
        passwordHash?: string
    }


export type MeViewModel =
    {
        email: string,
        login: string,
        userId: string
    }