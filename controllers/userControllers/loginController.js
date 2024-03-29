const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../../middlewares/sendTokenResponse')
const { userIsAlreadyLoggedInError, wrongLoginDataError } = require('../../errors/userErrors/userErrors')

const loginUser = tryCatchWrapper(async (req, res) => {
    // checks whether or not the user is logged in
    if (req.cookies['token'] || req.headers.authorization) {
        if (req.headers.authorization != 'Bearer null') {
            throw new userIsAlreadyLoggedInError()
        }
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        throw new wrongLoginDataError()
    }
    sendTokenResponse(user, StatusCodes.OK, res)
    return
})

module.exports = loginUser
