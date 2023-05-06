import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {activeSessionsService} from "../domain/active-sessions-service";
import {param} from "express-validator";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshToken(refreshToken)
    if(!result) {
        res.sendStatus(401)
        return
    }
    const deviceData = await activeSessionsService.findDeviceById(result.deviceId)
    res.send([deviceData])
})

securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshToken(refreshToken)
    if(!result) {
        res.sendStatus(401)
        return
    }
    await activeSessionsService.deleteAllOtherDevices(result.deviceId, result.userId)
    res.sendStatus(204)
})

securityDevicesRouter.delete('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyRefreshToken(refreshToken)
    if(!result) {
        res.sendStatus(401)
        return
    }

    const isDeleted = await activeSessionsService.deleteDeviceById(result.deviceId, result.userId)

    if(isDeleted === 'not found') {
        res.sendStatus(404)
        return
    }
    if(isDeleted === 'not own device') {
        res.sendStatus(403)
        return
    }

    res.sendStatus(204)
})