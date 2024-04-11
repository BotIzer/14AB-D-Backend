const Thread = require('../../models/threadModel')
const Comment = require('../../models/commentModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')

const getThreadsComments = tryCatchWrapper(async (req, res) => {
    const threadId = req.params.threadId
    const thread = await Thread.findOne({ '_id.thread_id': threadId })
    if (!thread) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'Thread not found',
        })
        return
    }
    const comments = await Comment.find({ '_id.room_id': threadId }).populate('_id.creator_id').select('username -_id')
    res.status(StatusCodes.OK).json(comments)
    return
})

module.exports = getThreadsComments
