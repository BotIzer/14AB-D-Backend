const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../../middlewares/sendTokenResponse')

const loginUser = tryCatchWrapper(async (req, res) => {
    // checks whether or not the user is logged in
    if (req.cookies['token']) {
        res.status(StatusCodes.FORBIDDEN).json({success: false})
        return
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: `Username or password is wrong` })
        return
    }
    sendTokenResponse(user, StatusCodes.OK, res)
    return
})

module.exports = loginUser
