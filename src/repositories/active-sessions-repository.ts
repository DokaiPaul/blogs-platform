import {client} from "../database/mongo-db";
import {ActiveSessionModel} from "../models/mongo-db-models/active-session-model";

const activeSessionsCollection = client.db('bloggers-platform').collection<ActiveSessionModel>('active-sessions')

export const activeSessionsRepository =
    {
        async findDevicesByUserId(userId: string) {
            return await activeSessionsCollection.find({userId: userId}) .toArray()
        },
        async findDeviceById (deviceId: string): Promise<ActiveSessionModel | null> {
            return await activeSessionsCollection.findOne({deviceId: deviceId})
        },
        async addDevice (newDevice: ActiveSessionModel) {
            return await activeSessionsCollection.insertOne(newDevice)
        },
        async updateDevice (deviceId: string, lastActiveDate: string) {
            return await activeSessionsCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: lastActiveDate}})
        },
        async deleteDeviceById (deviceId: string) {
            return await activeSessionsCollection.deleteOne({deviceId: deviceId})
        },
        async deleteAllOtherDevices (deviceId: string, userId: string) {
            return await activeSessionsCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
        }
    }