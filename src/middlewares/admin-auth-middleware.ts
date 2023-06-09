import {header} from "express-validator";
import {users} from "../database/users-db";
import {decodeBase64} from "../utils/decoders";

export const adminAuthMiddleware = header('Authorization')
    .notEmpty()
    .withMessage('You do not have permissions to perform this action')
    .bail()
    .custom(value => {
        const values: string[] = value.split(' ');
        const credentials = decodeBase64(values[1]);
        const type = values[0];
        if(type !== 'Basic') {
            throw new Error('You do not have permissions to perform this action')
        }
        const login = credentials[0];
        const pass = credentials[1];

        const user = users.find(u => u.login === login)
        if(user) {
            if(user.password === pass) {
                return true;
            }
        }
        throw new Error('You do not have permissions to perform this action')
    })