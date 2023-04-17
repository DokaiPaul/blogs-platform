import {
    blogIdValidationMiddleware,
    contentValidationMiddleware,
    descriptionValidationMiddleware,
    nameValidationMiddleware, shortDescriptionValidationMiddleware, titleValidationMiddleware,
    websiteUrlValidationMiddleware
} from "./common-validation-middleware";

export const bodyValidationMiddleware = [
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

export const postInBlogBodyValidationMiddleware = [
    titleValidationMiddleware,
    shortDescriptionValidationMiddleware,
    contentValidationMiddleware,
];
