import jwt, {JwtPayload} from 'jsonwebtoken'
import {client} from "../database/mongo-db";

const secret = process.env.JWT_SECRET || '123'

const revokedTokensCollection = client.db('bloggers-platform').collection('revoked-refresh-tokens')
export const jwtService =
    {
        async createAccessJWT (userId: string) {
            const token = jwt.sign({userId: userId}, secret, {expiresIn: '10s'})

            return token;
        },
        async createRefreshJWT(userId: string) {
            const token = jwt.sign({userId: userId}, secret, {expiresIn: '20s'})

            return token;
        },
        async verifyRefreshJWT(token: string): Promise<string | null> {
            try {
                const tok: any = await jwt.verify(token, secret)
                const isRevoked = await revokedTokensCollection.findOne({RefreshJWT: token})

                if(isRevoked) return null

                return tok.userId
            } catch (e) {
                return null
            }
        },
        async revokeRefreshJWT(token: string) {
            const tokenData = jwt.decode(token) as JwtPayload
            const expDate = tokenData!.exp
            return await revokedTokensCollection.insertOne({RefreshJWT: token, ExpirationDate: expDate})
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