export type ActiveSessionDbModel =
    {
        ip: string,
        title: string,
        lastActiveDate?: string,
        tokenExpirationDate?: string,
        deviceId: string,
        userId: string,

    }