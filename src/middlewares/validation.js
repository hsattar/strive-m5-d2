import { body } from 'express-validator'

export const blogsBodyValidator = [
    body('category').exists().withMessage('You Must Include A Category'),
    body('title').exists().withMessage('You Must Include A Title'),
    body('cover').exists().withMessage('You Must Include A Cover Image Link'),
    body('readTime.value').exists().withMessage('You Must Include A Read Time Value'),
    body('readTime.unit').exists().withMessage('You Must Include A Read Time Unit'),
    body('author.name').exists().withMessage('You Must Include An Author Name'),
    body('author.avatar').exists().withMessage('You Must Include An Author Avatar'),
    body('content').exists().withMessage('You Must Include Some Content')
]
