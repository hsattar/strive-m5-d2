import express from 'express'
import authorRoutes from './authors/index.js'

const server = express()
const port = 3001

server.use(express.json())

server.use('/authors', authorRoutes)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})