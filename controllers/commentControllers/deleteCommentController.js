const Comment = require('../../models/commentModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const deleteComment = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const commentId = req.params.commentId
    const comment = await Comment.findById(commentId)
    if (!comment) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' })
    }
    if (comment._id.creator_id.toString() !== userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You cannot delete this comment!' })
    }
    await comment.deleteOne()
    await comment.save()
})

module.exports = deleteComment
