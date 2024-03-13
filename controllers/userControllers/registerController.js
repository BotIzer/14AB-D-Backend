const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { userAlreadyExistsError, userIsAlreadyLoggedInError } = require('../../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../../middlewares/sendTokenResponse')

const registerUser = tryCatchWrapper(async (req, res) => {
    if (req.cookies['token'] || req.headers.authorization?.startsWith('Bearer')) {
        throw new userIsAlreadyLoggedInError()
    }
    if (req.body.username.length > 20) {
        res.status(StatusCodes.CONFLICT).json({ message: 'Username is too long' })
    }
    if (req.body.username.length < 2) {
        res.status(StatusCodes.CONFLICT).json({ message: 'Username is too short' })
    }
    if (req.body.username.split('_')[0] === 'deletedUser') {
        res.status(StatusCodes.CONFLICT).json({ message: 'You cannot register with deletedUser username' })
    }
    if (await User.findOne({ username: req.body.username })) {
        throw new userAlreadyExistsError(req.body.username)
    }
    if (await User.findOne({ email: req.body.email })) {
        throw new userAlreadyExistsError(req.body.email)
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
