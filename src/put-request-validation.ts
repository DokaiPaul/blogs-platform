import {supportedResolutions, VideoType} from "./db";

export const errorMsg = (field: string) => ({
    "errorsMessages": [
        {
            "message": "An error has been happened",
            "field": field
        }
    ]
})
export const putRequestValidate = (body: VideoType) => {
    const errorsArr = [];

    if (body.title && (typeof body.title !== 'string' || body.title.length > 40)) {
        let error = errorMsg("title");

        errorsArr.push(error);
    }
    if (body.author && (typeof body.author !== 'string' || body.author.length > 20)) {
        let error = errorMsg("author");

        errorsArr.push(error);
    }
    if (body.availableResolutions && (body.availableResolutions.length === 0 || !body.availableResolutions.every(v => supportedResolutions.includes(v)))) {
        let error = errorMsg("availableResolutions");

        errorsArr.push(error);
    }
    if(body.canBeDownloaded && typeof body.canBeDownloaded !== "boolean") {
        let error = errorMsg("canBeDownloaded");

        errorsArr.push(error);
    }
    if(body.minAgeRestriction && (typeof body.minAgeRestriction !== 'number' || +body.minAgeRestriction > 18  || +body.minAgeRestriction < 1)) {
        let error = errorMsg("minAgeRestriction");

        errorsArr.push(error);
    }
    const validDateFormat: RegExp = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d).([0-5]\d+)Z$/g;
    if(body.createdAt && (typeof body.createdAt !== "string" || !validDateFormat.test(body.createdAt))) {
        let error = errorMsg("createdAt");

        errorsArr.push(error);
    }
    if(body.publicationDate && (typeof body.publicationDate !== "string" || !validDateFormat.test(body.publicationDate))) {
        let error = errorMsg("publicationDate");

        errorsArr.push(error);
    }
    return errorsArr[0];
}
