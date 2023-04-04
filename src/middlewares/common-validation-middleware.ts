import {body} from "express-validator";
import {blogs_db} from "../database/blogs-db";

export const nameValidationMiddleware = body('name')
    .if(body('name').notEmpty())
    .isString()
    .withMessage('Name should be a string')
    .bail()
    .trim().isLength({min: 1, max: 15})
    .withMessage('Your name should be not empty or longer than 15 symbols');

export const descriptionValidationMiddleware = body('description')
    .if(body('description').notEmpty())
    .isString()
    .withMessage('Description should be a string')
    .bail()
    .isLength({min: 1, max: 500})
    .withMessage('Your description should be not empty or longer than 500 symbols');

export const websiteUrlValidationMiddleware = body('websiteUrl')
    .if(body('websiteUrl').notEmpty())
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
    .withMessage('Title should be not longer than 100 symbols');

export const contentValidationMiddleware = body('content')
    .isString()
    .withMessage('Content should be a string')
    .bail()
    .trim().isLength({min: 1, max: 1000})
    .withMessage('Title should be not longer than 1000 symbols');

export const blogIdValidationMiddleware = body('blogId')
    .isString()
    .withMessage('Blog ID should be a string')
    .bail()
    .custom((value) => {
        if(!blogs_db.find(b => b.id === value)) {
            throw new Error('This blogs ID does not exists')
        }
        return true;
    });