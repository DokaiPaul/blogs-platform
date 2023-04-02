import {body} from 'express-validator';

export const requiredFieldsValidationMiddleware = [
    body('name').notEmpty().withMessage('Name field should be not empty'),
    body('description').notEmpty().withMessage('Description should be not empty'),
    body('websiteUrl').notEmpty().withMessage('Web site field should be not empty')
]