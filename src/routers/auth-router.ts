import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login', body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const user = await userService.checkUsersCredentials(req.body)
    if(user) {
        //@ts-ignore
        const token = await jwtService.createJWT(user)
        res.status(200).json({"accessToken": token})
        return
    }
    res.sendStatus(401)
})

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const person = await usersQueryRepository.findUserById(req.userId)

    res.status(200).json(person)
})