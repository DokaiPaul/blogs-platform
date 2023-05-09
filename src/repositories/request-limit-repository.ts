import {IpRequestModel} from "../models/mongo-db-models/ip-request-model";
import {subSeconds} from "date-fns";
import {RateLimitModel} from "../database/models/rate-limit-model";

export const RequestLimitRepository =
    {
        //todo add typisation for all methods below
        async addRequest (data: IpRequestModel) {
            return await RateLimitModel.create(data)
        },
        async findRequestForIP (ip: string, url: string, date: Date) {
            const filter = {ip: ip, url: url, date: {$gte: subSeconds(date, 10)}}
            return RateLimitModel.find(filter)
        },
        async removeOutdatedRequests (date: Date) {
            return RateLimitModel.deleteMany({date: {$lt: subSeconds(date, 20)}})
        }
    }