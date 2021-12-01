import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import createHttpError from 'http-errors'

const blogRoutes = express.Router()

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), 'blogs.json')

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

blogRoutes.route('/')
    .get((req, res) => {
        try {
            const blogs = getBlogs()
            res.send(blogs)    
        } catch (error) {
            next(error)
        }
    })
    .post((req, res) => {
        try {
            const blogs = getBlogs()
            const newBlog = {
                id: uuidv4(),
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            blogs.push(newBlog)
            writeBlogs(blogs)
            res.status(201).send(newBlog)
        } catch (error) {
            next(error)
        }
    })

blogRoutes.route('/:blogId')
    .get((req, res, next) => {
        try {
            const blogs = getBlogs()
            const blog = blogs.find(blog => blog.id === req.params.blogId)
            if (blog) return res.send(blog)
            next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found.`))
        } catch (error) {
            next(error)
        }
    })
    .put((req, res, next) => {
        try {
            const blogs = getBlogs()
            const index = blogs.findIndex(blog => blog.id === req.params.blogId)
            if (index === -1) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found. Cannot Edit Blog That Doesn't Exist.`))
            blogs[index] = {
                ...blogs[index],
                ...req.body,
                updatedAt: new Date()
            }
            writeBlogs(blogs)
            res.send(blogs[index])
        } catch (error) {
            next(error)
        }
    })
    .delete((req, res, next) => {
        try {
            const blogs = getBlogs()
            const index = blogs.findIndex(blog => blog.id === req.params.blogId)
            if (index === -1) return next(createHttpError(404, `Blog With ID ${req.params.blogId} Not Found. Cannot Delete Blog That Doesn't Exist.`))
            const remainingBlogs = blogs.filter(blog => blog.id !== req.params.blogId)
            writeBlogs(remainingBlogs)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    })

export default blogRoutes