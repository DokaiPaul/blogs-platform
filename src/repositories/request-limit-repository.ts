import {IpRequestModel} from "../models/mongo-db-models/ip-request-model";
import {client} from "../database/mongo-db";
import {subSeconds} from "date-fns";

const rateLimitCollection = client.db('bloggers-platform').collection<IpRequestModel>('ip-requests')
export const RequestLimitRepository =
    {
        async addRequest (data: IpRequestModel) {
            await rateLimitCollection.insertOne(data)
        },
        async findRequestForIP (ip: string, url: string, date: Date) {
            const filter = {ip: ip, url: url, date: {$gte: subSeconds(date, 10)}}
            return rateLimitCollection.find(filter).toArray()
        }
    }