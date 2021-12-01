export const blogNotFound = (err, req, res, next) => {
    if (err.status === 404) res.status(404).send(err.message)
    next(err)
}

export const genericError = (err, req, res, next) => {
    res.status(500).send('Server Error')
}