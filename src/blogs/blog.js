import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { blogsBodyValidator, blogCommentValidator } from '../middlewares/validation.js'
import { getBlogs, writeBlogs, createBlogCover, getAuthors } from '../functions/fs-funcs.js'
import { generateBlogPDF } from '../functions/createPDF.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { pipeline } from 'stream'
import { sendTestEmail, sendNewBlogCreatedEmail } from '../functions/send-emails.js'

const blogRoutes = express.Router()

const averageReadingSpeed = 250

blogRoutes.route('/')
    .get( async (req, res, next) => {
        try {
            const blogs = await getBlogs()
            if (!req.query.title) return res.send(blogs)  
            const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(req.query.title.toLowerCase()))
            res.send(filteredBlogs)  
        } catch (error) {
            next(error)
        }
    })
    .post(blogsBodyValidator,  async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(createHttpError(400, { errors }))
            const blogs = await getBlogs()
            const blogWords = req.body.content.split(' ')
            const numberOfWords = blogWords.length
            const readingTime = Math.ceil(numberOfWords / averageReadingSpeed)
            const readingUnit = readingTime === 1 ? 'minute' : 'minutes'
            const authorNames = req.body.author.name.split(' ')
            const authors = await getAuthors()
            const authorExists = authors.find(author => req.body.author.name === `${author.name} ${author.surname}`)
            let email = null
            let authorAvatar = null
            if (authorExists) {
                email = authorExists.email
                authorAvatar = authorExists.avatar 
            }
            const newBlog = {
                id: uuidv4(),
                ...req.body,
                author: {
                    name: req.body.author.name,
                    avatar: authorAvatar || `https://ui-avatars.com/api/?name=${authorNames[0]}+${authorNames[1]}`
                },
                readTime: {
                    value: readingTime,
                    unit: readingUnit
                },
                comments: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            // console.log({authorExists, newBlog})
            blogs.push(newBlog)
            await writeBlogs(blogs)
            await sendNewBlogCreatedEmail(email, newBlog)
            res.status(201).send(newBlog)
        } catch (error) {
            next(error)
            console.log(error)
        }
    })


blogRoutes.post('/testEmail', async (req, res, next) => {
    try {
        sendTestEmail(req.body)
        res.send('OK')
    } catch (error) {
        console.error(error)
    }
})


blogRoutes.route('/:blogId')
    .get( async (req, res, next) => {
        try {
            const blogs = await getBlogs()
            const blog = blogs.find(blog => blog.id === req.params.blogId)
            if (blog) return res.send(blog)
            next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found.`))
        } catch (error) {
            next(error)
        }
    })
    .put( async (req, res, next) => {
        try {
            const blogs = await getBlogs()
            const index = blogs.findIndex(blog => blog.id === req.params.blogId)
            if (index === -1) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found. Cannot Edit Blog That Doesn't Exist.`))
            const blogContent = req.body.content || blogs[index].content
            const blogWords = blogContent.split(' ')
            const numberOfWords = blogWords.length
            const readingTime = Math.ceil(numberOfWords / averageReadingSpeed)
            const readingUnit = readingTime === 1 ? 'minute' : 'minutes'
            const authorName = req.body.author.name || blogs[index].author.name
            const authorNames = authorName.split(' ')
            blogs[index] = {
                ...blogs[index],
                ...req.body,
                author: {
                    name: req.body.author.name,
                    avatar: `https://ui-avatars.com/api/?name=${authorNames[0]}+${authorNames[1]}`
                },
                readTime: {
                    value: readingTime,
                    unit: readingUnit
                },
                updatedAt: new Date()
            }
            await writeBlogs(blogs)
            res.send(blogs[index])
        } catch (error) {
            next(error)
        }
    })
    .delete( async (req, res, next) => {
        try {
            const blogs = await getBlogs()
            const index = blogs.findIndex(blog => blog.id === req.params.blogId)
            if (index === -1) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found. Cannot Delete Blog That Doesn't Exist.`))
            const remainingBlogs = blogs.filter(blog => blog.id !== req.params.blogId)
            await writeBlogs(remainingBlogs)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    })

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'strive-blogs/blog-covers'
    }
})


blogRoutes.patch('/:blogId/uploadCover', multer({ storage }).single('cover'), async (req, res, next) => {
    try {
        // const originalFileName = req.file.originalname.split('.')
        // originalFileName[0] = req.params.blogId
        // const newFileName = originalFileName.join('.')
        // createBlogCover(newFileName, req.file.buffer)
        const blogs = await getBlogs()
        const index = blogs.findIndex(blog => blog.id === req.params.blogId)
        blogs[index] = {...blogs[index], cover: `${req.file.path}`}
        await writeBlogs(blogs)
        res.send(blogs[index])
    } catch (error) {
        next(error)
        console.log(error)
    }
})

blogRoutes.route('/:blogId/comments')
    .get(async (req, res, next) => {
        try {
            const blogs = await getBlogs()
            const blog = blogs.find(blog => blog.id === req.params.blogId)
            if (!blog) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found.`))
            res.send(blog.comments)
        } catch (error) {
            next(error)
        }
    })
    .post(blogCommentValidator, async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(createHttpError(400, { errors }))
            const blogs = await getBlogs()
            const index = blogs.findIndex(blog => blog.id === req.params.blogId)
            if (index === -1) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found.`))
            const blogComment = { ...req.body }
            blogs[index].comments.push(blogComment)
            writeBlogs(blogs)
            res.send(blogs[index])
        } catch (error) {
            next(error)
        }
    })


blogRoutes.get('/:blogId/downloadPDF', async (req, res, next) => {
    try {
        const blogs = await getBlogs()
        const blog = blogs.filter(blog => blog.id === req.params.blogId)
        if (!blog) return next(createHttpError(404, 'This Blog Does Not Exist'))

        const source = await generateBlogPDF(blog[0])
        res.setHeader('Content-Disposition', `attachment; filename=${blog[0].title}.pdf`)
        pipeline(source, res, err => {
            if (err) {
                console.log(err)
                next(err)
            }
        })
        source.end()
    } catch (error) {
        next(error)
        // console.log(error)
    }
})

export default blogRoutes