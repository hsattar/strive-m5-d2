import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const authorRoutes = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentFolder = dirname(currentFilePath)
const authorsJSON = join(currentFolder, 'authors.json')
const authors = JSON.parse(fs.readFileSync(authorsJSON))

authorRoutes.get('/', (req, res) => {
    res.send(authors)
})

authorRoutes.get('/:authorId', (req, res) => {
    const authorId = req.params.authorId
    const singleAuthor = authors.find(author => author.id === authorId)
    res.send(singleAuthor)
})

authorRoutes.post('/', (req, res) => {
    const receivedInput = req.body
    const newUser = {...receivedInput, id: uuidv4()}
    const updatedAuthors = authors.push(newUser)
    fs.writeFileSync(authorsJSON, JSON.stringify(updatedAuthors))
    res.status(201).send(newUser)    
})

authorRoutes.put('/:authorId', (req, res) => {
    res.send('put')
})

authorRoutes.delete('/:authorId', (req, res) => {
    res.send('delete')
})

export default authorRoutes