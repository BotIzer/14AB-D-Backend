const jwt = require('jsonwebtoken')

const getCreatorIdFromHeaders = (headers) => {
    const token = headers.authorization.split(' ')[1]
    const { id: decodedCreatorId } = jwt.verify(token, process.env.JWT_SECRET)
    return decodedCreatorId
}

module.exports = getCreatorIdFromHeaders
