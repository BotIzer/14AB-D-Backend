const notFound = (req, res) =>
    res
        .status(404)
        .json({message: `Route does not exist: ${req.method} on '${req.originalUrl}' path`})

module.exports = notFound
