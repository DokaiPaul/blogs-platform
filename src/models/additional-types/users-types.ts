export type User = {
    name: string,
    login: string,
    password: string,
    base64Encode: string
}

export type LoginSuccessViewModel =
    {
        accessToken: string
    }