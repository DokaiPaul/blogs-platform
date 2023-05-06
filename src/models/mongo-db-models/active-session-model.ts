export type ActiveSessionModel =
    {
        ip: string,
        title: string,
        lastActiveDate?: string,
        tokenExpirationDate?: string,
        deviceId: string,
        userId: string,

    }