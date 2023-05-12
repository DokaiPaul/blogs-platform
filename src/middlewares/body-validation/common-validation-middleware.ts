import {body} from "express-validator";
import {blogsRepository} from "../../repositories/blogs-repository";

export const nameValidationMiddleware = body('name')
    .notEmpty()
    .withMessage('Name field should be not empty')
    .bail()
    .isString()
    .withMessage('Name should be a string')
    .bail()
    .trim().isLength({min: 1, max: 15})
    .withMessage('Your name should be not empty or longer than 15 symbols');

export const descriptionValidationMiddleware = body('description')
    .notEmpty()
    .withMessage('Description should be not empty')
    .bail()
    .isString()
    .withMessage('Description should be a string')
    .bail()
    .isLength({min: 1, max: 500})
    .withMessage('Your description should be not empty or longer than 500 symbols');

export const websiteUrlValidationMiddleware = body('websiteUrl')
    .notEmpty()
    .withMessage('Website field should be not empty')
    .bail()
    .isString()
    .withMessage('Website URL should be a string')
    .bail()
    .isURL()
    .withMessage('You have to input valid URL')
    .bail()
    .isLength({max: 100})
    .withMessage('Your URL should be not longer than 100 symbols');

export const titleValidationMiddleware = body('title')
    .isString()
    .withMessage('Title should be a string')
    .bail()
    .trim().isLength({min: 1, max: 30})
    .withMessage('Title should be not longer than 30 symbols');

export const shortDescriptionValidationMiddleware = body('shortDescription')
    .isString()
    .withMessage('Description should be a string')
    .bail()
    .trim().isLength({min: 1, max: 100})
    .withMessage('Description should be not longer than 100 symbols');

export const contentValidationMiddleware = body('content')
    .isString()
    .withMessage('Content should be a string')
    .bail()
    .trim().isLength({min: 1, max: 1000})
    .withMessage('Content should be not longer than 1000 symbols');

export const blogIdValidationMiddleware = body('blogId')
    .isString()
    .withMessage('Blog ID should be a string')
    .bail()
    .isMongoId()
    .withMessage('Id should be in mongo ID format')
    .bail()
    .custom(async (value) => {

        if (!await blogsRepository.findBlogById(value)) {
            throw new Error('This blogs ID does not exists')
        }
        return true;
    });

export const loginValidation = body('login')
    .notEmpty()
    .bail()
    .isString()
    .withMessage('Login should be a string')
    .bail()
    .isLength({min: 3, max: 10})
    .withMessage('Length is incorrect and must be from 3 to 10 symbols')
    .bail()
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('You use incorrect pattern')

export const passwordValidation = body('password')
    .notEmpty()
    .bail()
    .isString()
    .withMessage('Password should be a string')
    .bail()
    .isLength({min: 6, max: 20})
    .withMessage('Length is incorrect and must be from 6 to 20 symbols')
    .bail()

export const newPasswordValidation = body('newPassword')
    .notEmpty()
    .bail()
    .isString()
    .withMessage('Password should be a string')
    .bail()
    .isLength({min: 6, max: 20})
    .withMessage('Length is incorrect and must be from 6 to 20 symbols')
    .bail()


export const emailValidation = body('email')
    .notEmpty()
    .bail()
    .isString()
    .withMessage('Email should be a string')
    .bail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('You use incorrect pattern')

export const contentValidation = body('content')
    .isString()
    .withMessage('Comment should be a string')
    .bail()
    .isLength({min: 20, max: 300})
    .withMessage(`Your comment's length should be between 20 and 300 symbols`)

export const recoveryCode = body('recoveryCode')
    .notEmpty()
    .withMessage('recovery code should be passed')
    .bail()
    .isString()
    .withMessage('recovery code should be a string')

export const likeStatus = body('likeStatus')
    .matches(/^None$|^Like$|^Dislike$/)
    .withMessage('Status should be valid')