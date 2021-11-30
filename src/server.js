import express from 'express'
import authorRoutes from './services/authors/index.js'

const server = express()
const port = 3001


server.use('/authors', authorRoutes)

server.listen(port, () => {
    console.log(`Server runnin on port ${port}`)
})