import express from 'express'

const bookRoutes = express.Router()

bookRoutes.post('/', (req, res) => {
    res.send('post')    
})

bookRoutes.get('/', (req, res) => {
    res.send('get')
})

bookRoutes.get('/:blogId', (req, res) => {
    res.send('get id')
})

bookRoutes.put('/:blogId', (req, res) => {
    res.send('put')
})

bookRoutes.delete('/:blogId', (req, res) => {
    res.send('delete')
})

export default bookRoutes