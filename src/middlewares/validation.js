import { body } from 'express-validator'

export const blogsBodyValidator = [
    body('category').exists().isLength({min: 1}).withMessage('You Must Include A Category'),
    body('title').exists().isLength({min: 1}).withMessage('You Must Include A Title'),
    body('cover').exists().isLength({min: 1}).withMessage('You Must Include A Cover Image Link'),
    body('author.name').exists().isLength({min: 1}).withMessage('You Must Include An Author Name'),
    body('content').exists().isLength({min: 1}).withMessage('You Must Include Some Content')
]

export const blogCommentValidator = [
    body('author').exists().isLength({min: 1}).withMessage('You Must Include An Author Name'),
    body('text').exists().isLength({min: 1}).withMessage('You Must Include Some Text')
]
