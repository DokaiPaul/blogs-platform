import {supportedResolutions} from "../../database/videos_db";
import {ErrorMessages} from "../../models/additional-types/errors-types";
import {VideoType} from "../../models/view-models/videos-view-model";
import {errorMsg} from "../errors/errors";


export const putRequestValidate = (body: VideoType) => {
    const errorsArr: ErrorMessages = {
        "errorsMessages": []
    };

    //check if the body from request contains properties. If not, create error message and get out of the function
    if (Object.keys(body).length === 0) {
        let error = errorMsg("Your body does not have any property", "body");
        errorsArr.errorsMessages.push(error);
        return errorsArr
    }
    if (!body.title || (typeof body.title !== 'string' || body.title.trim().length > 40)) {
        let error = errorMsg("Title's length should be not longer than 40 symbols", "title");

        errorsArr.errorsMessages.push(error);
    }
    if (typeof body.author !== undefined && (typeof body.author !== 'string' || body.author.trim().length > 20)) {
        let error = errorMsg("Author's length should be not longer than 20 symbols", "author");

        errorsArr.errorsMessages.push(error);
    }
    if (typeof body.availableResolutions !== undefined&& (body.availableResolutions.length === 0 || !body.availableResolutions.every(v => supportedResolutions.includes(v)))) {
        let error = errorMsg("Please enter the valid Resolution from 144 to 2160", "availableResolutions");

        errorsArr.errorsMessages.push(error);
    }
    if (typeof body.canBeDownloaded !== undefined && typeof body.canBeDownloaded !== "boolean") {
        let error = errorMsg("Choose true or false", "canBeDownloaded");

        errorsArr.errorsMessages.push(error);
    }
    if (typeof body.minAgeRestriction !== undefined) {
        if(typeof body.minAgeRestriction !== 'number' || +body.minAgeRestriction > 18 || +body.minAgeRestriction < 1) {
            let error = errorMsg("You have to input the number only", "minAgeRestriction");

            errorsArr.errorsMessages.push(error);
        }
    }
    const validDateFormat: RegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d).([0-9]\d+)Z$/g;
    if (typeof body.createdAt !== undefined && (typeof body.createdAt !== "string" || !validDateFormat.test(body.createdAt))) {
        let error = errorMsg("Your date is invalid", "createdAt");

        errorsArr.errorsMessages.push(error);
    }
    if (typeof body.publicationDate !== undefined && (typeof body.publicationDate !== "string" || !validDateFormat.test(body.publicationDate))) {
        let error = errorMsg("Your date is invalid","publicationDate");

        errorsArr.errorsMessages.push(error);
    }

    return errorsArr;
}
