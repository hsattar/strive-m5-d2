import { body } from 'express-validator'

export const blogsBodyValidator = [
    body('category').exists().withMessage('You Must Include A Category'),
    body('title').exists().withMessage('You Must Include A Title'),
    body('cover').exists().withMessage('You Must Include A Cover Image Link'),
    body('content').exists().withMessage('You Must Include Some Content'),
]
