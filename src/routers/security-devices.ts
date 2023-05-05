import {Router, Request, Response} from "express";

export const securityDevicesRouter = Router({})

//todo add logic for check token validation and get deviceId
securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    console.log(req.originalUrl)
    // const isValidRefreshToken =await
    // if(!isValidRefreshToken) {
    //     res.sendStatus(401)
    //     return
    // }
    // const deviceDate = await
    // res.json(deviceData)
})

//todo complete JWT verification and perform removing all other sessions
securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    // const isValidRefreshToken =await
    // if(!isValidRefreshToken) {
    //     res.sendStatus(401)
    //     return
    // }
    // await sessionsService.deleteDeviceSessions
    // res.sendStatus(204)+
})

//todo complete JWT verification and add removing particular session by deviceId
securityDevicesRouter.delete('/:id', async (req: Request, res: Response) => {
    // const isValidRefreshToken =await
    // if(!isValidRefreshToken) {
    //     res.sendStatus(401)
    //     return
    // }

    // const result = await

    // if(!result) {
    //     res.sendStatus(404)
    //     return
    // }
    // if(result === 'other user') {
    //     res.sendStatus(403)
    //     return
    // }

    // res.sendStatus(204)
})