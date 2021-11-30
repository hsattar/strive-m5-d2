import express from 'express'

const authorRoutes = express.Router()

authorRoutes.get('/', (req, res) => {
    res.send('get')
})

authorRoutes.get('/:blogId', (req, res) => {
    res.send('get id')
})

authorRoutes.post('/', (req, res) => {
    res.send('post')    
})

authorRoutes.put('/:blogId', (req, res) => {
    res.send('put')
})

authorRoutes.delete('/:blogId', (req, res) => {
    res.send('delete')
})

export default authorRoutes