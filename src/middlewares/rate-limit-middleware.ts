import {NextFunction, Request, Response} from "express";
import {RequestLimitRepository} from "../repositories/request-limit-repository";

export const checkRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress

    if(!ip) {
        res.sendStatus(400)
        return
    }

    const url = req.baseUrl
    const date = new Date()

    await RequestLimitRepository.addRequest({ip, url, date})

    const result = await RequestLimitRepository.findRequestForIP(ip, url, date)

    if(result.length > 5) {
        res.sendStatus(429)
        return
    }

    next()
}