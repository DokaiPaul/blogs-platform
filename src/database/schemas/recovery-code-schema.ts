import mongoose from "mongoose";
import {RecoveryCodeDbModel} from "../../models/mongo-db-models/recovery-code-db-model";

export const RecoveryCodeSchema = new mongoose.Schema<RecoveryCodeDbModel>({
    email: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    isUsed: {type: Boolean, required: true},
    creationDate: {type: Date, required: true}
})