const { getUserInfoFromToken } = require('../controllers/userControllers/userController')

const sendTokenResponse = async (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const userInfo = await getUserInfoFromToken(token)
    res.json({ success: true, userInfo: userInfo, token: token})
    return
}

module.exports = sendTokenResponse
