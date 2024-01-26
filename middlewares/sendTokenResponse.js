const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    }
    res.status(statusCode).cookie('token', token, options)
    res.json({success: 'true'})
    return
}

module.exports = sendTokenResponse