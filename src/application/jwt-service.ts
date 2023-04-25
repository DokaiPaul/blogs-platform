import jwt from 'jsonwebtoken'
import {UserDbModel} from "../models/mongo-db-models/users-db-model";

const secret = process.env.JWT_SECRET || '123'

export const jwtService =
    {
        async createJWT (user: UserDbModel) {
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