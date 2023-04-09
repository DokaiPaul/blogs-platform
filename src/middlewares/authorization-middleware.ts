import {header} from "express-validator";
import {users} from "../database/users-db";
import {decodeBase64} from "../utils/decoders";

export const authorizationMiddleware = header('Authorization')
    .custom(value => {
        const credentials = decodeBase64(value);
        const login = credentials[0];
        const pass = credentials[1];

        const user = users.filter(u => u.login === login)
        if(user) {
            if(user[0].password === pass) {
                return true;
            }
        }
        throw new Error('You do not have permissions to perform this action')
    })