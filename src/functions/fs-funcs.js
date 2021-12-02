import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')

export const getBlogs = () => readJSON(join(dataFolderPath, 'blogs.json'))
export const writeBlogs = content => writeJSON(join(dataFolderPath, 'blogs.json'), content)
export const getAuthors = () => readJSON(join(dataFolderPath, 'authors.json'))
export const writeAuthors = content => writeJSON(join(dataFolderPath, 'authors.json'), content)
