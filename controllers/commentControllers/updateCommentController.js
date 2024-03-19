const Comment = require('../../models/commentModel')
const Chatroom = require('../../models/chatroomModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const updateComment = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const commentId = req.params.commentId
    const comment = await Comment.findById(commentId)
    if (!comment) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' })
    }
    if (comment._id.creator_id.toString() !== userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You cannot edit this comment!' })
    }
    if (req.body.text && req.body.text.length > 2000) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Comment too long' })
    }
    if (req.body._id || req.body.creation_date || req.body.likes || req.body.dislikes || req.body.emoticons) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot edit this field!' })
    }
    comment.updateOne(req.body)
    await comment.save()
})

module.exports = updateComment