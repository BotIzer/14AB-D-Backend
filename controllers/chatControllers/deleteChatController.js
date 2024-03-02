const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const Comment = require('../../models/commentModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const deleteChat = tryCatchWrapper(async (req, res) => {
    const chatId = req.params.chatId
    const deleterUser = await getCreatorIdFromHeaders(req.headers)
    const chat = await Chat.findOne({ _id: chatId })
    if (chat) {
        if (chat.creator_id == deleterUser && chat.is_private == true) {
            await Chat.findByIdAndDelete(chatId)
            await User.updateMany({ chats: { $in: [chatId] } }, { $pull: { chats: chatId } })
            await Comment.deleteMany({ '_id.room_id': chatId })
            return res.status(StatusCodes.OK).json({ message: 'Chat deleted successfully.' })
        }
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not allowed to delete this chat.' })
    }
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No chat found.' })
})

module.exports = deleteChat
