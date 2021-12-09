import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
const authorsJSONPath = join(dataFolderPath, 'authors.json')
const blogsJSONPath = join(dataFolderPath, 'blogs.json')

export const publicFolderPath = join(process.cwd(), 'public')
const authorAvatarsPath = join(publicFolderPath, 'author-avatars')
const blogCoversPath = join(publicFolderPath, 'blog-covers')
export const blogPDFsPath = join(publicFolderPath, 'blog-pdfs')

export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = content => writeJSON(blogsJSONPath, content)
export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)
export const createAuthorAvatar = (fileName, content) => writeFile(join(authorAvatarsPath, fileName), content)
export const createBlogCover = (fileName, content) => writeFile(join(blogCoversPath, fileName), content)
export const getAuthorsStream = () => createReadStream(authorsJSONPath)