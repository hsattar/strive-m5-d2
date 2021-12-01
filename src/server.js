import express from 'express'
import authorRoutes from './authors/index.js'
import blogRoutes from './blogs/blog.js'
import cors from 'cors'
import { blogNotFound, genericError } from './middlewares/errorHandlers.js'

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())

server.use('/authors', authorRoutes)
server.use('/blogs', blogRoutes)

server.use(blogNotFound)
server.use(genericError)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})