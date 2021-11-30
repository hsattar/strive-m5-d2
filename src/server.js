import express from 'express'
import bookRoutes from './blogs/index.js'

const server = express()
const port = 3001




server.listen(port, () => {
    console.log(`Server runnin on port ${port}`)
})