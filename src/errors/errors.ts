import {ErrorMessage} from "../types/errors-types";
import {strict} from "assert";

export const errorMsg = (message: string, field: string): ErrorMessage => {
    return {
        "message": message,
        "field": field
    }
}