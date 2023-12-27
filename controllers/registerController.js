const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const { userAlreadyExistsError } = require('../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
// const sendTokenResponse = require('../middlewares/sendTokenResponse')

const registerUser = tryCatchWrapper(async (req, res) => {
    if (await User.findOne({ email: req.body.email })) {
        throw new userAlreadyExistsError(`User already exists with this email: ${req.body.email}`)
    }
    let newUser = new User({
        email: req.body.email,
        username: req.body.username,
    })
    newUser.password = newUser.generateHash(req.body.password)
    newUser.save()
    // const token = newUser.getSignedJwtToken()
    // res.status(StatusCodes.CREATED).json({ newUser: newUser, token: token })
    // return
    sendTokenResponse(newUser, StatusCodes.CREATED, res)
    return
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
    }
    res.status(statusCode).cookie('token', token, options).json({ token })
    return
}


module.exports = registerUser
