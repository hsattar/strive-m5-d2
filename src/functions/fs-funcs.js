import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
const publicFolderPath = join(process.cwd(), 'public')
const authorAvatarsPath = join(publicFolderPath, 'author-avatars')
const blogCoversPath = join(publicFolderPath, 'blog-covers')

export const getBlogs = () => readJSON(join(dataFolderPath, 'blogs.json'))
export const writeBlogs = content => writeJSON(join(dataFolderPath, 'blogs.json'), content)
export const getAuthors = () => readJSON(join(dataFolderPath, 'authors.json'))
export const writeAuthors = content => writeJSON(join(dataFolderPath, 'authors.json'), content)
export const createAuthorAvatar = (fileName, content) => writeFile(join(authorAvatarsPath, fileName), content)
export const createBlogCover = (fileName, content) => writeFile(join(blogCoversPath, fileName), content)
