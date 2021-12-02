import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { blogsBodyValidator } from '../middlewares/validation.js'
import { getBlogs, writeBlogs } from '../functions/fs-funcs.js'

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
            const newBlog = {
                id: uuidv4(),
                ...req.body,
                author: {
                    name: req.body.author.name,
                    avatar: `https://ui-avatars.com/api/?name=${authorNames[0]}+${authorNames[1]}`
                },
                readTime: {
                    value: readingTime,
                    unit: readingUnit
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
            blogs.push(newBlog)
            await writeBlogs(blogs)
            res.status(201).send(newBlog)
        } catch (error) {
            next(error)
            console.log(error)
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

export default blogRoutes