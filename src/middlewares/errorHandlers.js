export const badRequest = (err, req, res, next) => {
    if (err.status === 400) return res.status(400).send(err.errors)
    next(err)
}

export const blogNotFound = (err, req, res, next) => {
    if (err.status === 404) return res.status(404).send(err.message)
    next(err)
}

export const genericError = (err, req, res, next) => {
    res.status(500).send('Server Error')
}