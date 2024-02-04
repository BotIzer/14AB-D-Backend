const { getUserInfoFromToken } = require('../controllers/userControllers/userController')

const sendTokenResponse = async (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    res.status(statusCode).cookie('token', token, options)
    const userInfo = await getUserInfoFromToken(token)
    // {sameSite: 'None', expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)}
    // we have to set it to sameSite once we have https
    res.cookie('userInfo', JSON.stringify(userInfo), {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: 'None'
    })
    res.json({ success: 'true' })
    return
}

module.exports = sendTokenResponse
