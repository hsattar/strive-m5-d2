import express from 'express'
import fs, { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const authorRoutes = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentFolder = dirname(currentFilePath)
const authorsJSON = join(currentFolder, 'authors.json')
const authors = JSON.parse(readFileSync(authorsJSON))

authorRoutes.get('/', (req, res) => {
    res.send(authors)
})

authorRoutes.get('/:authorId', (req, res) => {
    const authorId = req.params.authorId
    const singleAuthor = authors.find(author => author.id === authorId)
    res.send(singleAuthor)
})

authorRoutes.post('/', (req, res) => {
    res.send('post')    
})

authorRoutes.put('/:authorId', (req, res) => {
    res.send('put')
})

authorRoutes.delete('/:authorId', (req, res) => {
    res.send('delete')
})

export default authorRoutes