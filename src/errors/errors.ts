import {ErrorMessage} from "../types/errors-types";

export const errorMsg = (field: string): ErrorMessage => {
    return {
        "message": "An error has been happened",
        "field": field
    }
}