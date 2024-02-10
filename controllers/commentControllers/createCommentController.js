const Comment = require('../../models/commentModel')
const Chatroom = require('../../models/chatroomModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noChatFoundError } = require('../../errors/chatErrors/chatErrors')
const { parentCommentDoesNotExistError, tooLongCommentError } = require('../../errors/commentErrors/commentErrors')

const createComment = tryCatchWrapper(async (req, res) => {
    const {
        room_id: roomId,
        text: text,
        is_reply: isReply,
        parent_comment_id: parentCommentId,
        sequential_number: sequentialNumber,
    } = req.body
    if (!(await Chatroom.findById(roomId))) {
        throw new noChatFoundError(roomId)
    }
    if (isReply && !(await Comment.findById(parentCommentId))) {
        throw new parentCommentDoesNotExistError(parentCommentId)
    }
    if (text.length > 2000) {
        throw new tooLongCommentError(text.length)
    }
    const decodedCreatorId = getCreatorIdFromHeaders(req.headers)
    if (!isReply) {
        parentCommentId = null
        sequentialNumber = 0
    }
    let newChatroom = new Chatroom({
        _id: {
            room_id: roomId,
            creator_id: decodedCreatorId,
        },
        text: text,
        reply: {
            is_reply: isReply,
            parent_comment_id: parentCommentId,
            sequential_number: sequentialNumber,
        },
    })
    newChatroom.save()
    res.status(StatusCodes.CREATED).json({ success: true })
    return
})

module.exports = createComment
