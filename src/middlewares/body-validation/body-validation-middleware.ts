import {
    blogIdValidationMiddleware,
    contentValidation,
    contentValidationMiddleware,
    descriptionValidationMiddleware,
    emailValidation,
    loginValidation,
    nameValidationMiddleware,
    passwordValidation,
    recoveryCode,
    shortDescriptionValidationMiddleware,
    titleValidationMiddleware,
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

export const usersBodyValidationMiddleware = [
    loginValidation,
    passwordValidation,
    emailValidation
]

export const commentBodyValidationMiddleware = [
    contentValidation
]

export const passwordRecoveryValidationMiddleware = [
    passwordValidation,
    recoveryCode
]