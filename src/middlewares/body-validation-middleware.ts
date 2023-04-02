import {body} from 'express-validator';

export const bodyValidationMiddleware = [
    body('name')
        .if(body('name').notEmpty())
        .isString()
        .withMessage('Name should be a string')
        .bail()
        .trim().isLength({min: 1, max: 15})
        .withMessage('Your name should be not empty or longer than 15 symbols'),
    body('description')
        .if(body('description').notEmpty())
        .isString()
        .withMessage('Description should be a string')
        .bail()
        .isLength({min: 1, max: 500})
        .withMessage('Your description should be not empty or longer than 500 symbols')
        .bail(),
    body('websiteUrl')
        .if(body('websiteUrl').notEmpty())
        .isString()
        .withMessage('Description should be a string')
        .bail()
        .isURL()
        .withMessage('You have to input valid URL')
        .bail()
        .isLength({max: 100})
        .withMessage('Your URL should be not longer than 100 symbols')]
