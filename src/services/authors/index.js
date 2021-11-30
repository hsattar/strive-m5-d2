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