import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {jwtService} from "../application/jwt-service";
import {usersBodyValidationMiddleware} from "../middlewares/body-validation/body-validation-middleware";
import {checkRateLimit} from "../middlewares/rate-limit-middleware";

export const authRouter = Router({})

authRouter.post('/login', checkRateLimit ,body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const user = await userService.checkUsersCredentials(req.body)
    if(user) {
        const token = await jwtService.createAccessJWT(user._id!.toString())
        const refreshToken = await jwtService.createRefreshJWT(user._id!.toString())

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.status(200).json({"accessToken": token})
        return
    }
    res.sendStatus(401)
})

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    if(!req.userId) {
        res.sendStatus(404)
        return
    }
    const person = await usersQueryRepository.findUserById(req.userId)

    res.status(200).json(person)
})

authRouter.post('/registration',
    checkRateLimit,
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
    checkRateLimit,
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

authRouter.post('/refresh-token', checkRateLimit, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshJWT(refreshToken)

    if(!result) {
        res.sendStatus(401)
        return
    }
    await jwtService.revokeRefreshJWT(refreshToken)

    const accessToken = await jwtService.createAccessJWT(result)
    const newRefreshToken = await jwtService.createRefreshJWT(result)

    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    res.status(200).json({"accessToken": accessToken})
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshJWT(refreshToken)

    if(!result) {
        res.sendStatus(401)
        return
    }
    await jwtService.revokeRefreshJWT(refreshToken)
    res.sendStatus(204)
})