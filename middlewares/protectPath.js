const jwt = require('jsonwebtoken')
const { noPermissionToUsePathError } = require('../errors/userErrors/userErrors')
const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const otherUniqueError = require('../errors/otherUniqueError')
const { StatusCodes } = require('http-status-codes')

const protectPath = tryCatchWrapper(async (req, res, next) => {
    if (req.headers.authorization == 'Bearer null') {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You need to log in to access the chats page!' })
    }
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        throw new noPermissionToUsePathError(req.originalUrl)
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)
    next()
})

module.exports = protectPath
