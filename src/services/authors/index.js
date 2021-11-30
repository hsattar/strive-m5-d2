import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const authorRoutes = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentFolder = dirname(currentFilePath)
const authorsJSON = join(currentFolder, 'authors.json')

authorRoutes.get('/', (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSON))
    res.send(authors)
})

authorRoutes.get('/:authorId', (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSON))
    const authorId = req.params.authorId
    const singleAuthor = authors.find(author => author.id === authorId)
    res.send(singleAuthor)
})

authorRoutes.post('/', (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSON))
    const receivedInput = req.body
    const newUser = {...receivedInput, id: uuidv4()}
    authors.push(newUser)
    fs.writeFileSync(authorsJSON, JSON.stringify(authors))
    res.status(201).send(newUser)    
})

authorRoutes.put('/:authorId', (req, res) => {
    res.send('put')
})

authorRoutes.delete('/:authorId', (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSON))
    const authorId = req.params.authorId
    const remainingAuthors = authors.filter(author => author.id !== authorId)
    fs.writeFileSync(authorsJSON, JSON.stringify(remainingAuthors))
    res.status(204).send()
})

export default authorRoutes