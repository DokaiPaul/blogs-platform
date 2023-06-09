import {Router, Request, Response} from "express";
import {userService} from "../domain/users-service";
import {emailValidation, passwordValidation} from "../middlewares/body-validation/common-validation-middleware";
import {body} from "express-validator";
import {checkErrors} from "../middlewares/check-errors";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {authMiddleware} from "../middlewares/autorization-middleware";
import {jwtService} from "../application/jwt-service";
import {
    passwordRecoveryValidationMiddleware,
    usersBodyValidationMiddleware
} from "../middlewares/body-validation/body-validation-middleware";
import {checkRateLimit} from "../middlewares/rate-limit-middleware";
import {v4 as uuidv4} from "uuid";
import {ActiveSessionDbModel} from "../models/mongo-db-models/active-session-db-model";
import {activeSessionsService} from "../domain/active-sessions-service";
import {ObjectId} from "mongodb";

export const authRouter = Router({})

authRouter.post('/login', checkRateLimit ,body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const user = await userService.checkUsersCredentials(req.body)
    if(user) {
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress

        if(!user._id || !req.headers['user-agent'] || !ip) {
            res.sendStatus(400)
            return
        }

        const sessionInfo: ActiveSessionDbModel = {
            _id: new ObjectId(),
            deviceId: uuidv4(),
            userId: user._id.toString(),
            ip,
            lastActiveDate: 'date',
            title: req.headers['user-agent']
        }

        const result = await activeSessionsService.addDevice(sessionInfo)

        if(!result) {
            res.sendStatus(500)
            return
        }

        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
        res.status(200).json({"accessToken": result.accessToken})
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
    checkRateLimit,
    emailValidation,
    checkErrors,
    async (req: Request, res: Response) => {

        const result = await userService.resendConfirmation(req.body.email)
        if(!result) {
            res.status(400).send({ errorsMessages: [{ message: 'Email is already confirmed', field: "email" }] })
            return
        }
        res.sendStatus(204)
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshToken(refreshToken)

    if(!result) {
        res.sendStatus(401)
        return
    }

    const isUpdated = await activeSessionsService.updateDevice(refreshToken)

    if(!isUpdated) {
        res.sendStatus(500)
        return
    }

    res.cookie('refreshToken', isUpdated.newRefreshToken, {httpOnly: true, secure: true})
    res.status(200).json({"accessToken": isUpdated.newAccessToken})
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshToken(refreshToken)

    if(!result) {
        res.sendStatus(401)
        return
    }
    await activeSessionsService.deleteDeviceById(result.deviceId, result.userId)
    res.sendStatus(204)
})

authRouter.post('/password-recovery',
    checkRateLimit,
    emailValidation,
    checkErrors,
    async (req: Request, res: Response) => {

        await userService.sendEmailToRecoverPassword(req.body.email)

        res.sendStatus(204) //send 204 status even there is no such email in DB. This is created to avoid real emails detection
})

authRouter.post('/new-password',
    checkRateLimit,
    passwordRecoveryValidationMiddleware,
    checkErrors,
    async (req: Request, res: Response) => {
        const {newPassword, recoveryCode} = req.body
        const result = await userService.confirmPasswordRecovery({newPassword, recoveryCode})

        if(!result) {
            res.status(400).send({ errorsMessages: [{ message: 'Code is incorrect', field: "recoveryCode" }] })
            return
        }

        res.sendStatus(204)
})