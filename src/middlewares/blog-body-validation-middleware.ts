import {
    blogIdValidationMiddleware,
    contentValidationMiddleware,
    descriptionValidationMiddleware,
    nameValidationMiddleware, shortDescriptionValidationMiddleware, titleValidationMiddleware,
    websiteUrlValidationMiddleware
} from "./common-validation-middleware";

export const blogBodyValidationMiddleware = [
    nameValidationMiddleware,
    descriptionValidationMiddleware,
    websiteUrlValidationMiddleware
];

export const postBodyValidationMiddleware = [
    titleValidationMiddleware,
    shortDescriptionValidationMiddleware,
    contentValidationMiddleware,
    blogIdValidationMiddleware
];
