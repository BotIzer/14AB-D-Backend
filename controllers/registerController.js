const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const { userAlreadyExistsError } = require('../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../middlewares/sendTokenResponse')

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
    sendTokenResponse(newUser, StatusCodes.CREATED, res)
    return
})


module.exports = registerUser
