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
import {v4 as uuidv4} from "uuid";
import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";
import {activeSessionsService} from "../domain/active-sessions-service";

export const authRouter = Router({})

authRouter.post('/login', checkRateLimit ,body('loginOrEmail').isString(), passwordValidation, checkErrors, async (req: Request, res: Response) => {
    const user = await userService.checkUsersCredentials(req.body)
    if(user) {
        const token = await jwtService.createAccessJWT(user._id!.toString())
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress

        if(!user._id || !req.headers['user-agent'] || !ip) {
            res.sendStatus(400)
            return
        }


        const sessionInfo: ActiveSessionModel = {
            deviceId: uuidv4(),
            userId: user._id.toString(),
            ip,
            title: req.headers['user-agent']
        }

        const refreshToken = await jwtService.createRefreshJWT(sessionInfo.deviceId, sessionInfo.userId)
        const parsedRToken = await jwtService.parseJWT(refreshToken)

        if(!parsedRToken.exp || !parsedRToken.iat) {
            res.sendStatus(500)
            return
        }
        sessionInfo.tokenExpirationDate = new Date(new Date(0).setUTCSeconds(parsedRToken.exp)).toISOString()
        sessionInfo.lastActiveDate = new Date(new Date(0).setUTCSeconds(parsedRToken.iat)).toISOString()

        const result = await activeSessionsService.addDevice(sessionInfo)

        if(!result) {
            res.sendStatus(500)
            return
        }

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
    checkRateLimit,
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
    const result = await jwtService.verifyRefreshToken(refreshToken)

    if(!result) {
        res.sendStatus(401)
        return
    }

    const updatedRJWT = await jwtService.createRefreshJWT(result.deviceId, result.userId)
    const parsedToken = await jwtService.parseJWT(updatedRJWT)
    const accessToken = await jwtService.createAccessJWT(result.userId)

    if(!parsedToken.iat) {
        res.sendStatus(500)
        return
    }

    await activeSessionsService.updateDevice(parsedToken.deviceId, parsedToken.iat.toLocaleString())

    res.cookie('refreshToken', updatedRJWT, {httpOnly: true, secure: true})
    res.status(200).json({"accessToken": accessToken})
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