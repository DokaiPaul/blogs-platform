import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";
import {activeSessionsRepository} from "../repositories/active-sessions-repository";
import {jwtService} from "../application/jwt-service";

export const activeSessionsService =
    {
        async findDeviceById(deviceId: string) {
                const session = await activeSessionsRepository.findDeviceById(deviceId)
                if(!session || !session.lastActiveDate) return null

                return {
                        ip: session.ip,
                        title: session.title,
                        lastActiveDate: session.lastActiveDate,
                        deviceId: session.deviceId
                }
        },
        async findDevicesByUserId(userId: string) {
                const sessions = await activeSessionsRepository.findDevicesByUserId(userId)

                return sessions.map(v => {
                        return {
                                ip: v.ip,
                                title: v.title,
                                lastActiveDate: v.lastActiveDate,
                                deviceId: v.deviceId
                        }
                })
        },
        async addDevice (sessionInfo: ActiveSessionModel) {
                const accessToken = await jwtService.createAccessJWT(sessionInfo.userId)
                const refreshToken = await jwtService.createRefreshJWT(sessionInfo.deviceId, sessionInfo.userId)
                const parsedRToken = await jwtService.parseJWT(refreshToken)

                if(!parsedRToken.exp || !parsedRToken.iat) return null

                sessionInfo.tokenExpirationDate = new Date(new Date(0).setUTCSeconds(parsedRToken.exp)).toISOString()
                sessionInfo.lastActiveDate = new Date(new Date(0).setUTCSeconds(parsedRToken.iat)).toISOString()

                const result = await activeSessionsRepository.addDevice(sessionInfo)

                return {accessToken, refreshToken, result}
        },
        async updateDevice (oldToken: string): Promise<{newRefreshToken: string, newAccessToken: string} | null> {
                const parsedOldToken = await jwtService.parseJWT(oldToken)
                const updatedRJWT = await jwtService.createRefreshJWT(parsedOldToken.deviceId, parsedOldToken.userId)

                const parsedUpdatedToken = await jwtService.parseJWT(updatedRJWT)
                const accessToken = await jwtService.createAccessJWT(parsedOldToken.userId)

                if(!parsedUpdatedToken.iat || !parsedUpdatedToken.exp) return null

                const lastUpdateDate = new Date(new Date(0).setUTCSeconds(parsedUpdatedToken.iat)).toISOString()
                const expirationDate = new Date(new Date(0).setUTCSeconds(parsedUpdatedToken.exp)).toISOString()

                const result = await activeSessionsRepository.updateDevice(parsedOldToken.deviceId, lastUpdateDate, expirationDate)
                if(result.matchedCount !== 1) return null

                return {
                        newRefreshToken: updatedRJWT,
                        newAccessToken: accessToken
                }
        },
        async deleteDeviceById (deviceId: string, userId: string): Promise<string | null> {
                const isDeviceExist = await activeSessionsRepository.findDeviceById(deviceId)
                if(!isDeviceExist) return 'not found'

                if(isDeviceExist.userId !== userId) return 'not own device'

                const result = await activeSessionsRepository.deleteDeviceById(deviceId)

                if(result.deletedCount === 1) return 'success'
                return null
        },
        async deleteAllOtherDevices (deviceId: string, userId: string) {
                const result = await activeSessionsRepository.deleteAllOtherDevices(deviceId, userId)
                return result.acknowledged
        }
    }