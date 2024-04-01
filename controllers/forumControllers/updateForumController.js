const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const updateForum = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const isOwner = Forum.exists({ '_id.creator_id': userId, '_id.forum_id': req.params.forumId })
    if (!isOwner) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `You have no forum with id: ${req.params.forumId}`,
        })
        return
    }
    await Forum.updateOne({ '_id.forum_id': req.params.forumId }, req.body)
    res.status(StatusCodes.OK).json({
        message: 'Forum updated',
    })
})

module.exports = updateForum
