const jwt = require('jsonwebtoken')
const noPermissionToUsePathError = require('../errors/userErrors/noPermissionToUsePathError')
const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')

const protectPath = tryCatchWrapper(async (req, res, next) => {
    let token
    if (!token) {
        throw new noPermissionToUsePathError(req.originalUrl)
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)
    next()
})

module.exports = protectPath