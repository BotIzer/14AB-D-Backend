const Forum = require('../../models/forumModel')
const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const banUserFromForum = tryCatchWrapper(async (req, res) => {
    const forum = await Forum.findOne({ '_id.forum_id': req.body.forum_id })
    if (!forum) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forum found',
        })
        return
    }
    const bannerId = await getCreatorIdFromHeaders(req.headers)
    if (bannerId != forum._id.creator_id.toString() && (await User.findById(bannerId).role) != 'admin') {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are not authorized to ban users from this forum',
        })
        return
    }
    const userName = req.body.user_name
    const userId = (await User.findOne({ username: userName }))._id
    if (forum.blacklist.includes(userId)) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'User is already banned from this forum',
        })
        return
    }
    forum.blacklist.push(userId)
    await forum.save()
    res.status(StatusCodes.OK).json({
        message: 'User banned from forum',
    })
    return
})

module.exports = banUserFromForum
