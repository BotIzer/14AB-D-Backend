const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { userDoesNotHaveChatsYetError } = require('../../errors/userErrors/userErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const getUsersChats = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    let chats = await User.findById(id).populate('chats').select('chats -_id')
    if (!chats) {
        throw new userDoesNotHaveChatsYetError()
    }
    chats = chats.chats.map((chat) => ({
        _id: chat._id,
        name: chat.name,
        is_private: chat.is_private,
    }))
    res.status(StatusCodes.OK).json({ chats })
    return
})

module.exports = getUsersChats
