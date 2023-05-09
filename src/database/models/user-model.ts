import mongoose from "mongoose";
import {UserDbModel} from "../../models/mongo-db-models/users-db-model";
import {UserSchema} from "../schemas/user-schema";

export const UserModel = mongoose.model<UserDbModel>('users', UserSchema)