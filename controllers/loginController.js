const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const updaterOptions = {
    new: true,
    runValidators: true,
}
const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
}

const loginUser = tryCatchWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(404).json({ message: `Username or password is wrong` })
        return
    }
    const accessToken = jwt.sign(
        {
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECTER,
        {
            expiresIn: '10m',
        }
    )
    const refreshToken = jwt.sign(
        {
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECTER,
        {
            expiresIn: '1d',
        }
    )
    await User.findOneAndUpdate({ email: req.body.email }, { refresh_token: refreshToken }, updaterOptions)

    res.cookie('jwt', refreshToken, cookieOptions)

    res.status(200).json({ message: 'Login was successful!', accessToken: accessToken })
    return
})

module.exports = loginUser
