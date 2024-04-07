const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const Thread = require('../../models/threadModel')

const getAllThreadsByForumId = tryCatchWrapper(async (req, res) => {
    const threads = await Thread.find({ '_id.forum_id': req.params.forumId })
    if (!threads) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No threads found',
        })
        return
    }
    res.status(StatusCodes.OK).json(threads)
    return
})

module.exports = getAllThreadsByForumId
