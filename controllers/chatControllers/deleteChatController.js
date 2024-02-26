const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const Comment = require('../../models/commentModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const mongoose = require('mongoose')

const deleteChat = tryCatchWrapper(async (req, res) => {
    const chatId = req.params.chatId
    const ownerId = await getCreatorIdFromHeaders(req.headers)
    const chat = await Chat.findOne({ _id: chatId, owner: ownerId })
    console.log(chat)
    if (chat) {
        await Chat.findByIdAndDelete(chatId)
        await User.updateMany({ chats: { $in: [chatId] } }, { $pull: { chats: chatId } })
        await Comment.deleteMany({ '_id.room_id': chatId })
        return res.status(StatusCodes.OK).json({ message: 'Chat deleted successfully.' })
    }
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No chat found.' })
})

module.exports = deleteChat
