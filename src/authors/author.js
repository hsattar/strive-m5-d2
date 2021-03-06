import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'
import { getAuthors, writeAuthors, getBlogs, createAuthorAvatar, writeBlogs, getAuthorsStream } from '../functions/fs-funcs.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { pipeline } from 'stream'
import json2csv from 'json2csv'

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
            avatar: req.body.avatar || `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        authors.push(newUser)
        await writeAuthors(authors)
        res.status(201).send(newUser)    
    })

authorRoutes.get('/downloadCSV', async (req, res, next) => {
    try {
        res.setHeader('Content-Disposition', 'attachment; fileName=authors.csv')
        const source = await getAuthorsStream()
        const transform = new json2csv.Transform({ fields: ['name', 'surname', 'email'] })
        pipeline(source, transform, res, err => {
            if (err) {
                console.log(err)
                next(err)
            }
        })

    } catch (error) {
        next(error)
        console.log(error)
    }
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

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'strive-blogs/author-avatars'
    }
})

authorRoutes.patch('/:authorId/uploadAvatar', multer({ storage }).single('avatar'), async (req, res, next) => {
    try {
        const authors = await getAuthors()
        const index = authors.findIndex(author => author.id === req.params.authorId)
        authors[index] = {...authors[index], avatar: `${req.file.path}`}
        await writeAuthors(authors)
        const blogs = await getBlogs()
        const author = authors.find(author => author.id === req.params.authorId)
        const authorName = `${author.name} ${author.surname}`
        const authorBlogs = blogs.filter(blog => blog.author.name === authorName)
        if (authorBlogs.length === 0) return res.send(authors[index])
        if (authorBlogs.length === 1) {
            const index = blogs.findIndex(blog => blog.id === authorBlogs[0].id)
            blogs[index] = {...blogs[index], author: { name: `${authorName}`, avatar: `${req.file.path}`}}
        }
        if (authorBlogs.length > 1) {
            for (let i = 0; i < authorBlogs.length; i++) {
                const index = blogs.findIndex(blog => blog.id === authorBlogs[i].id)
                blogs[index] = {...blogs[index], author: { name: `${authorName}`, avatar: `${req.file.path}`}}
            }
        }
        await writeBlogs(blogs)
        res.send(authors[index])
    } catch (error) {
        next(error)
        console.log(error)
    }
})


authorRoutes.post('/checkEmail',  async (req, res, next) => {
    const authors = await getAuthors()
    const email = req.body.email
    const emailExists = authors.some(author => author.email === email)
    res.send(emailExists)
})

export default authorRoutes