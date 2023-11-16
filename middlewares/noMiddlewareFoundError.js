const notFound = (req, res) =>
    res
        .status(404)
        .send(`Route does not exist: ${req.method} on '${req.originalUrl}' path`)

module.exports = notFound
