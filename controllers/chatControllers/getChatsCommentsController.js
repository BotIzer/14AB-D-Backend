const Chat = require('../../models/chatroomModel')
const Comment = require('../../models/commentModel')
const { StatusCodes } = require('http-status-codes')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { noChatFoundError } = require('../../errors/chatErrors/chatErrors')

const getChatsComments = tryCatchWrapper(async (req, res) => {
    const chat = await Chat.findById(req.params.chatId)
    if (!chat) {
        throw new noChatFoundError(req.params.chatId)
    }
    const comments = await Comment.find({ '_id.room_id': chat._id })
    res.status(StatusCodes.OK).json({ comments })
    return
})

module.exports = getChatsComments
