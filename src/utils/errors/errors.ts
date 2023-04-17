import {ErrorMessage} from "../../models/additional-types/errors-types";

export const errorMsg = (message: string, field: string): ErrorMessage => {
    return {
        "message": message,
        "field": field
    }
}