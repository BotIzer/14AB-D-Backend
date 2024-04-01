const Comment = require('../../models/commentModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const {
    noCommentFoundError,
    cannotEditCommentError,
    tooLongCommentError,
    cannotEditFieldError,
} = require('../../errors/commentErrors/commentErrors')

const updaterOptions = {
    new: true,
    runValidators: true,
}

const updateComment = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const commentId = req.params.commentId

    const comment = await Comment.findOne({ '_id.message_id': commentId })
    if (!comment) {
        throw new noCommentFoundError()
    }
    if (comment._id.creator_id.toString() != userId) {
        throw new cannotEditCommentError()
    }
    if (req.body.text && req.body.text.length > 2000) {
        throw new tooLongCommentError(req.body.text.length)
    }
    if (req.body._id || req.body.creation_date || req.body.likes || req.body.dislikes || req.body.emoticons) {
        throw new cannotEditFieldError()
    }
    await Comment.updateOne({ '_id.message_id': commentId }, req.body, updaterOptions)
    res.status(StatusCodes.OK).json({ message: 'Comment updated successfully' })
})

module.exports = updateComment
