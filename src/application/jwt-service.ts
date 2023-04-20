import {UsersType} from "../models/view-models/users-view-model";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";

const secret = process.env.JWT_SECRET || '123'

export const jwtService =
    {
        async createJWT (user: UsersType) {
            const token = jwt.sign({userId: user._id}, secret, {expiresIn: '1d'})

            return token;
        },
        async getUserByIdToken (token: string) {
            try {
                const result: any = jwt.verify(token, secret)
                return result.userId
            } catch (e) {
                return null
            }
        }
    }