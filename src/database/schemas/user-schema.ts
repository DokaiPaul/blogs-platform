import mongoose from "mongoose";
import {UserDbModel} from "../../models/mongo-db-models/users-db-model";

export const UserSchema = new mongoose.Schema<UserDbModel>({
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: Date, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    }
})