import mongoose from "mongoose";
import {ActiveSessionDbModel} from "../../models/mongo-db-models/active-session-db-model";
import {ActiveSessionSchema} from "../schemas/active-session-schema";

export const ActiveSessionModel = mongoose.model<ActiveSessionDbModel>('active-sessions', ActiveSessionSchema)