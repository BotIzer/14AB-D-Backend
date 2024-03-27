const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')

const changePassword = tryCatchWrapper(async (req, res, next) => {
    // const userId = await getCreatorIdFromHeaders(req.headers)
    const userId = '65ca57ef7b4f2295c385b4f9'
    const user = await User.findById(userId)
    if (!user) {
        throw new noUserFoundError(userId)
    }
    const { old_passwd: oldPasswd, new_passwd: newPasswd, new_passwd2: newPasswd2 } = req.body
    if (!user.validPassword(user, oldPasswd)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Your given password is not matching with the one in the database',
        })
    }
    if (newPasswd !== newPasswd2) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'New passwords do not match',
        })
    }
    res.locals.userId = userId
    res.locals.newPasswd = newPasswd
    next()
})

module.exports = changePassword
