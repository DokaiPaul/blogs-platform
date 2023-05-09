import {ActiveSessionDbModel} from "../models/mongo-db-models/active-session-db-model";
import {ActiveSessionModel} from "../database/models/active-session-model";


export const activeSessionsRepository =
    {
        //todo add type of output global for all methods below!!!
        async findDevicesByUserId(userId: string) {
            return ActiveSessionModel.find({userId: userId})
        },
        async findDeviceById (deviceId: string): Promise<ActiveSessionDbModel | null> {
            return ActiveSessionModel.findOne({deviceId: deviceId})
        },
        async addDevice (newDevice: ActiveSessionDbModel) {
            return await ActiveSessionModel.create(newDevice)
        },
        async updateDevice (deviceId: string, lastActiveDate: string, expDate: string) {
            return ActiveSessionModel.updateOne({deviceId: deviceId}, {lastActiveDate: lastActiveDate, tokenExpirationDate: expDate})
        },
        async deleteDeviceById (deviceId: string) {
            return ActiveSessionModel.deleteOne({deviceId: deviceId})
        },
        async deleteAllOtherDevices (deviceId: string, userId: string) {
            return ActiveSessionModel.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
        }
    }