const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const deleteForum = tryCatchWrapper(async (req, res) => {
    const forum = await Forum.findOne({ forum_name: req.headers.forumname })
    if (!forum) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forum found',
        })
        return
    }
    const id = await getCreatorIdFromHeaders(req.headers)
    if (id != forum._id.creator_id.toString()) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are not authorized to delete this forum',
        })
        return
    }
    await Forum.findByIdAndDelete(forum._id)
    res.status(StatusCodes.OK).json({
        message: 'Forum deleted',
    })
    return
})

module.exports = deleteForum
