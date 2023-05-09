import mongoose from "mongoose";
import {ActiveSessionDbModel} from "../../models/mongo-db-models/active-session-db-model";

export const ActiveSessionSchema = new mongoose.Schema<ActiveSessionDbModel>({
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: false},
    tokenExpirationDate: {type: String, required: false},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true}
})