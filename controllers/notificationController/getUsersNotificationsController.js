const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { StatusCodes } = require('http-status-codes')

const getUsersNotifications = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const user = await User.findById(userId)
    if (!user) {
        throw new noUserFoundError()
    }
    res.status(StatusCodes.OK).json(user.notifications)
    return
})

module.exports = getUsersNotifications