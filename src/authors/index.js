import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const authorRoutes = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentFolder = dirname(currentFilePath)
const authorsJSON = join(currentFolder, 'authors.json')

// DEFAULT ROUTE - GET, POST
authorRoutes.route('/')
    .get((req, res) => {
        const authors = JSON.parse(fs.readFileSync(authorsJSON))
        res.send(authors)
    })
    .post((req, res) => {
        const authors = JSON.parse(fs.readFileSync(authorsJSON))
        const emailExists = authors.some(author => author.email === req.body.email)
        if (emailExists) return res.status(400).send('A user with this email already exists')
        const newUser = {
            id: uuidv4(), 
            ...req.body, 
            avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        authors.push(newUser)
        fs.writeFileSync(authorsJSON, JSON.stringify(authors))
        res.status(201).send(newUser)    
    })


// SPECIFIC AUTHOR ROUTE - GET, PUT, DELETE
authorRoutes.route('/:authorId')
    .get((req, res) => {
        const authors = JSON.parse(fs.readFileSync(authorsJSON))
        const authorId = req.params.authorId
        const singleAuthor = authors.find(author => author.id === authorId)
        res.send(singleAuthor)
    })
    .put((req, res) => {
        const authors = JSON.parse(fs.readFileSync(authorsJSON))
        const authorId = req.params.authorId
        const index = authors.findIndex(author => author.id === authorId)
        authors[index] = {
            ...authors[index], 
            ...req.body,
            avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
            updatedAt: new Date()
        }
        const updatedDetails = authors[index]
        fs.writeFileSync(authorsJSON, JSON.stringify(authors))
        res.send(updatedDetails)
    })
    .delete((req, res) => {
        const authors = JSON.parse(fs.readFileSync(authorsJSON))
        const authorId = req.params.authorId
        const remainingAuthors = authors.filter(author => author.id !== authorId)
        fs.writeFileSync(authorsJSON, JSON.stringify(remainingAuthors))
        res.status(204).send()
    })


authorRoutes.post('/checkEmail', (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSON))
    const email = req.body.email
    const emailExists = authors.some(author => author.email === email)
    res.send(emailExists)
})

export default authorRoutes