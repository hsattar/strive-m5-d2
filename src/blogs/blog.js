import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const blogRoutes = express.Router()

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), 'blogs.json')

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

blogRoutes.route('/')
    .get((req, res) => {
        const blogs = getBlogs()
        res.send(blogs)
    })
    .post((req, res) => {
        const blogs = getBlogs()
        const newBlog = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date()
        }
        blogs.push(newBlog)
        writeBlogs(blogs)
        res.status(201).send(newBlog)
    })

blogRoutes.route('/:blogId')
    .get((req, res) => {
        const blogs = getBlogs()
        const blog = blogs.find(blog => blog.id === req.params.blogId)
        res.send(blog)
    })
    .put((req, res) => {

    })
    .delete((req, res) => {
        const blogs = getBlogs()
        const remainingBlogs = blogs.filter(blog => blog.id !== req.params.blogId)
        writeBlogs(remainingBlogs)
        res.status(204).send()
    })

export default blogRoutes