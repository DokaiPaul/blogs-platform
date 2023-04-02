import {header} from "express-validator";
import {users} from "../database/users-db";

export const authorizationMiddleware = header('Authorization')
    .equals(users[0].base64Encode) //to equal the admin base64 Encode
    .withMessage('You do not have permissions to perform this action')