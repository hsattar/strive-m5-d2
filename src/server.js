import express from 'express'
import authorRoutes from './authors/author.js'
import blogRoutes from './blogs/blog.js'
import cors from 'cors'
import { badRequest, blogNotFound, genericError } from './middlewares/errorHandlers.js'
import { publicFolderPath } from './functions/fs-funcs.js'
import listEndpoints from 'express-list-endpoints'

const server = express()
const port = process.env.PORT

const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
    origin: (origin, next) => {
        if (!origin || whiteList.indexOf(origin) !== -1) {
            next(null, true)
        } else {
            next(new Error('CORS ERROR'))
        }
    }
}

server.use(cors(corsOptions))
server.use(express.json())
server.use(express.static(publicFolderPath))

server.use('/authors', authorRoutes)
server.use('/blogs', blogRoutes)

server.use(badRequest)
server.use(blogNotFound)
server.use(genericError)

// console.log(listEndpoints(server))
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})