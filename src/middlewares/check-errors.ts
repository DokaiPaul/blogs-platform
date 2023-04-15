import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {errorMsg} from "../utils/errors/errors";
import {ErrorMessages} from "../types/errors-types";

export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
    const errorsArr: ErrorMessages = {
        "errorsMessages": []
    };
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        errors.array().forEach(e => {
            let errorsResult = errorMsg(e.msg, e.param)
            errorsArr.errorsMessages.push(errorsResult)
            if(e.param === 'authorization') { //if the error is because of authorisation return 401 status
                res.status(401).json(errorsArr)
                return
            }
        })
        res.status(400).json(errorsArr)
    }
    else {
        next()
    }
}