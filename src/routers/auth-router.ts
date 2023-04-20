import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";

export const authRouter = Router({})

authRouter.post('/login', body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const isAllowed = await userService.checkUsersCredentials(req.body)
    if(isAllowed) {
        res.sendStatus(204)
        return
    }
    res.sendStatus(401)
})

authRouter.get('/me', , async (req: Request, res: Response) => {
    const person = await usersQueryRepository.findUserById(req.headers.id)

    res.status(200).json(person)
})