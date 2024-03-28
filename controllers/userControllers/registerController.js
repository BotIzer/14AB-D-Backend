const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { userAlreadyExistsError, userIsAlreadyLoggedInError } = require('../../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
const sendTokenResponse = require('../../middlewares/sendTokenResponse')
const crypro = require('crypto')
const nodemailer = require('nodemailer')

const registerUser = tryCatchWrapper(async (req, res) => {
    if (req.cookies['token'] || req.headers.authorization) {
        if (req.headers.authorization != 'Bearer null') {
          throw new userIsAlreadyLoggedInError()
        }
    }
    if (req.body.username.length > 20) {
        res.status(StatusCodes.CONFLICT).json({ message: 'Username is too long' })
        return
    }
    if (req.body.username.length < 2) {
        res.status(StatusCodes.CONFLICT).json({ message: 'Username is too short' })
        return
    }
    if (req.body.username === 'deletedUser' || req.body.username.split('_')[0] === 'deletedUser') {
        res.status(StatusCodes.CONFLICT).json({ message: 'You cannot register with deletedUser username' })
        return
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
        emailToken: crypro.randomBytes(64).toString('hex'),
    })
    newUser.password = newUser.generateHash(req.body.password)
    newUser.save()
    await sendRegisterEmail(newUser.email, newUser.emailToken)
    sendTokenResponse(newUser, StatusCodes.CREATED, res)
    return
})

const verifyEmail = tryCatchWrapper(async (req, res) => {
    const emailToken = req.params.emailToken
    if (!emailToken) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email token is required' })
        return
    }
    const user = await User.findOne({ emailToken })
    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid email token' })
        return
    }
    user.emailToken = null
    user.isVerified = true
    await user.save()
    res.status(StatusCodes.OK).json({ message: 'Email verified successfully' })
})

const sendRegisterEmail = tryCatchWrapper(async (userEmail, emailToken) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    })

    var mailOptions = {
        from: { name: 'BlitzForFriends', address: process.env.EMAIL },
        to: userEmail,
        subject: 'Verify your email',
        html: `Click <a href="${process.env.BACKEND_URL}/verifyEmail/${emailToken}">here</a> to verify your email`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
    return res.status(StatusCodes.OK).json({ message: `Email verification email sent to: ${userEmail}!` })
})

module.exports = { registerUser, verifyEmail }
