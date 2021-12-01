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

    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    })

export default blogRoutes