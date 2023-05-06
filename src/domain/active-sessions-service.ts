import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";
import {activeSessionsRepository} from "../repositories/active-sessions-repository";

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
        async addDevice (newDevice: ActiveSessionModel) {
               return activeSessionsRepository.addDevice(newDevice)
        },
        async updateDevice (deviceId: string, lastActiveDate: string) {
                await activeSessionsRepository.updateDevice(deviceId, lastActiveDate)
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