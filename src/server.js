import express from 'express'
import authorRoutes from './authors/author.js'
import blogRoutes from './blogs/blog.js'
import cors from 'cors'
import { badRequest, blogNotFound, genericError } from './middlewares/errorHandlers.js'

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())

server.use('/authors', authorRoutes)
server.use('/blogs', blogRoutes)

server.use(badRequest)
server.use(blogNotFound)
server.use(genericError)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})