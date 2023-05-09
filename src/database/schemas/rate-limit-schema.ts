import mongoose from "mongoose";
import {IpRequestModel} from "../../models/mongo-db-models/ip-request-model";

export const RateLimitSchema = new mongoose.Schema<IpRequestModel>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true},
})