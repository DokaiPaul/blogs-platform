import mongoose from "mongoose";
import {RecoveryCodeSchema} from "../schemas/recovery-code-schema";
import {RecoveryCodeDbModel} from "../../models/mongo-db-models/recovery-code-db-model";

export const RecoveryCodeModel = mongoose.model<RecoveryCodeDbModel>('recovery-codes', RecoveryCodeSchema)