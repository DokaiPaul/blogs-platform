import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {jwtService} from "../application/jwt-service";
import {usersBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";

export const authRouter = Router({})

authRouter.post('/login', body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const user = await userService.checkUsersCredentials(req.body)
    if(user) {
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

authRouter.post('/registration',
    usersBodyValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await userService.createUser(req.body)
        if(!result) {
            res.sendStatus(400)
            return
        }

        if(result === 'email') {
            res.status(400).json({ errorsMessages: [{ message: 'This email is already taken', field: "email" }] })
            return
        }

        if(result === 'login') {
            res.status(400).json({ errorsMessages: [{ message: 'This login is already taken', field: "login" }] })
            return
        }


        res.sendStatus(204)
})

authRouter.post('/registration-confirmation',
    body('code').isString().withMessage('Code should be a string'),
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await userService.confirmEmail(req.body.code)
        if(!result) {
            res.status(400).send({ errorsMessages: [{ message: 'Some issue with code', field: "code" }] })
            return
        }
        res.sendStatus(204)
})

authRouter.post('/registration-email-resending',
    body('email').isString().withMessage('Your email should be a string').bail()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Your email is incorrect'),
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await userService.resendConfirmation(req.body.email)
        if(!result) {
            res.status(400).send({ errorsMessages: [{ message: 'Email is already confirmed', field: "email" }] })
            return
        }
        res.sendStatus(204)
})