const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { noUserFoundError } = require('../errors/userErrors/userErrors')

const getCreatorIdFromHeaders = async (headers) => {
    const token = headers.authorization.split(' ')[1]
    const { id: decodedCreatorId } = jwt.verify(token, process.env.JWT_SECRET)
    if (!(await User.findById(decodedCreatorId))) {
        throw new noUserFoundError(decodedCreatorId)
    }
    return decodedCreatorId
}

module.exports = getCreatorIdFromHeaders
