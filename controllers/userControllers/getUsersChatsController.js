const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { userDoesNotHaveChatsYetError } = require('../../errors/userErrors/userErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const getUsersChats = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const chats = await User.findById(id).populate('chats')
    if (chats.chats.length === 0) {
        throw new userDoesNotHaveChatsYetError()
    }
    res.status(StatusCodes.OK).json({ chats })
    return
})

module.exports = getUsersChats
