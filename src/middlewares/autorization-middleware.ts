import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserByIdToken(token)
    if(userId) {
        //@ts-ignore
        req.userId = userId
        next()
        return
    }
    res.sendStatus(401)
}