import {client} from "../database/mongo-db";
import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";

const activeSessionsCollection = client.db('bloggers-platform').collection<ActiveSessionModel>('active-sessions')

export const activeSessionsRepository =
    {
        async findDeviceById (deviceId: string) {
            return activeSessionsCollection.findOne({deviceId: deviceId})
        },
        async addDevice (newDevice: ActiveSessionModel) {
            return activeSessionsCollection.insertOne(newDevice)
        },
        async updateDevice (deviceId: string, lastActiveDate: string) {
            return activeSessionsCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: lastActiveDate}})
        },
        async deleteDeviceById (deviceId: string) {
            return activeSessionsCollection.deleteOne({deviceId: deviceId})
        },
        async deleteAllOtherDevices (deviceId: string, userId: string) {
            return activeSessionsCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
        }
    }