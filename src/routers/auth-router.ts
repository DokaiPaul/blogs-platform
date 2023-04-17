import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";

export const authRouter = Router({})

authRouter.post('/login', body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const isAllowed = await userService.checkUsersCredentials(req.body)
    if(isAllowed) {
        res.sendStatus(204)
        return
    }
    res.sendStatus(401)
})