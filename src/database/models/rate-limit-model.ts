import mongoose from "mongoose";
import {IpRequestModel} from "../../models/mongo-db-models/ip-request-model";
import {RateLimitSchema} from "../schemas/rate-limit-schema";

export const RateLimitModel = mongoose.model<IpRequestModel>('ip-requests', RateLimitSchema)