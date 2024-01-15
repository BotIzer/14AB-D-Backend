const jwt = require('jsonwebtoken')
const tryCatchWrapper = require('./tryCatchWrapper')

const getUserIdFromToken = tryCatchWrapper((token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    return decodedToken.id
})

module.exports = getUserIdFromToken
