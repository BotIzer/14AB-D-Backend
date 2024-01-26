const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../../middlewares/sendTokenResponse')
require('dotenv').config()

const loginUser = tryCatchWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: `Username or password is wrong` })
        return
    }
   //res.status(StatusCodes.OK).json({}) //it stoppes here
    sendTokenResponse(user, StatusCodes.OK, res)
    return
})

module.exports = loginUser
