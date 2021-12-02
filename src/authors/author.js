import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'
import { getAuthors, writeAuthors, getBlogs, createAuthorAvatar } from '../functions/fs-funcs.js'
import multer from 'multer'

const authorRoutes = express.Router()

// DEFAULT ROUTE - GET, POST
authorRoutes.route('/')
    .get( async (req, res, next) => {
        const authors = await getAuthors()
        res.send(authors)
    })
    .post( async (req, res, next) => {
        const authors = await getAuthors()
        const emailExists = authors.some(author => author.email === req.body.email)
        if (emailExists) return res.status(400).send('A user with this email already exists')
        const newUser = {
            id: uuidv4(), 
            ...req.body, 
            avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        authors.push(newUser)
        await writeAuthors(authors)
        res.status(201).send(newUser)    
    })


// SPECIFIC AUTHOR ROUTE - GET, PUT, DELETE
authorRoutes.route('/:authorId')
    .get( async (req, res, next) => {
        const authors = await getAuthors()
        const authorId = req.params.authorId
        const singleAuthor = authors.find(author => author.id === authorId)
        res.send(singleAuthor)
    })
    .put( async (req, res, next) => {
        const authors = await getAuthors()
        const authorId = req.params.authorId
        const index = authors.findIndex(author => author.id === authorId)
        authors[index] = {
            ...authors[index], 
            ...req.body,
            avatar: `https://ui-avatars.com/api/?name=${req.body.name || authors[index].name}+${req.body.surname || authors[index].surname}`,
            updatedAt: new Date()
        }
        const updatedDetails = authors[index]
        await writeAuthors(authors)
        res.send(updatedDetails)
    })
    .delete( async (req, res, next) => {
        const authors = await getAuthors()
        const authorId = req.params.authorId
        const remainingAuthors = authors.filter(author => author.id !== authorId)
        await writeAuthors(remainingAuthors)
        res.status(204).send()
    })


authorRoutes.get('/:authorId/blogs', async (req, res, next) => {
    try {
        const authors = await getAuthors()
        const blogs = await getBlogs()
        const singleAuthor = authors.find(author => author.id === req.params.authorId)
        const authorName = `${singleAuthor.name} ${singleAuthor.surname}`
        const authorBlogs = blogs.filter(blog => blog.author.name.toLowerCase() === authorName.toLowerCase())
        if (authorBlogs.length < 1) return next(createHttpError(404, 'No Blogs Found For This Author.'))
        res.send(authorBlogs)
    } catch (error) {
        next(error)
    }
})

authorRoutes.patch('/:authorId/uploadAvatar', multer().single('avatar'), async (req, res, next) => {
    try {
        const originalFileName = req.file.originalname.split('.')
        originalFileName[0] = req.params.authorId
        const newFileName = originalFileName.join('.')
        createAuthorAvatar(newFileName, req.file.buffer)
        const authors = await getAuthors()
        const index = authors.findIndex(author => author.id === req.params.authorId)
        authors[index] = {...authors[index], avatar: `http://127.0.0.1:3001/author-avatars/${newFileName}`}
        await writeAuthors(authors)
        res.send(authors[index])
    } catch (error) {
        next(error)
    }
})


authorRoutes.post('/checkEmail',  async (req, res, next) => {
    const authors = await getAuthors()
    const email = req.body.email
    const emailExists = authors.some(author => author.email === email)
    res.send(emailExists)
})

export default authorRoutes