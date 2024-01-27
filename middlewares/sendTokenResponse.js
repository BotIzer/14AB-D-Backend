const { getUserInfoFromToken } = require("../controllers/userControllers/userController")

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    }
    res.status(statusCode).cookie('token', token, options)
    res.json({success: 'true'})
    // I am. Sorry.
    // I AM A GENIUS HOLY
    // I'm a dumbass
    getUserInfoFromToken(token,res)
    return
}

module.exports = sendTokenResponse