import jwt, {JwtPayload} from 'jsonwebtoken'
import {activeSessionsRepository} from "../repositories/active-sessions-repository";

const secret = process.env.JWT_SECRET || '123'


export const jwtService =
    {
        async createAccessJWT (userId: string) {
            const token = jwt.sign({userId}, secret, {expiresIn: '300s'})

            return token;
        },
        async createRefreshJWT(deviceId: string, userId: string) {
            const token = jwt.sign({deviceId, userId}, secret, {expiresIn: '10d'})

            return token;
        },
        async parseJWT(token: string) {
            return jwt.decode(token) as JwtPayload
        },
        async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
            try {
                const tok: any = await jwt.verify(token, secret)
                const session = await activeSessionsRepository.findDeviceById(tok.deviceId)

                if(!tok) return null
                if(!session) return null
                if(session.lastActiveDate !== new Date(new Date(0).setUTCSeconds(tok.iat)).toISOString()) return null

                return tok
            } catch (e) {
                return null
            }
        },
        async getUserByIdToken (token: string) {
            try {
                const result: any = jwt.verify(token, secret)
                return result.userId
            } catch (e) {
                return null
            }
        },
        async getUserIdByJWT (token: string) {
            try {
                const result: any = jwt.decode(token)
                return result.userId
            } catch (e) {
                return null
            }
        }
    }