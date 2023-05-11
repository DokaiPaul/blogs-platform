import {param} from "express-validator";

export const isMongoId = param('id').isMongoId()