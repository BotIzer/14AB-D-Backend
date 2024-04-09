const Thread = require('../../models/threadModel')
const Comment = require('../../models/commentModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')

const getThreadsComments = tryCatchWrapper(async (req, res) => {
    const threadId = req.params.threadId
    const thread = await Thread.findById(threadId)
    if (!thread) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'Thread not found',
        })
        return
    }
    const comments = await Comment.find({ '_id.room_id': threadId })
    res.status(StatusCodes.OK).json(comments)
    return
})

module.exports = getThreadsComments
