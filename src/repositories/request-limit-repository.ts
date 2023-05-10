import {IpRequestModel} from "../models/mongo-db-models/ip-request-model";
import {subSeconds} from "date-fns";
import {RateLimitModel} from "../database/models/rate-limit-model";
import {DeletedObject} from "../models/additional-types/mongo-db-types";

export const RequestLimitRepository =
    {
        //todo add typisation for the output
        async addRequest (data: IpRequestModel) {
            return await RateLimitModel.create(data)
        },
        async findRequestForIP (ip: string, url: string, date: Date): Promise<IpRequestModel | null> {
            const filter = {ip: ip, url: url, date: {$gte: subSeconds(date, 10)}}
            return RateLimitModel.find(filter).lean()
        },
        async removeOutdatedRequests (date: Date): Promise<DeletedObject> {
            return RateLimitModel.deleteMany({date: {$lt: subSeconds(date, 20)}})
        }
    }