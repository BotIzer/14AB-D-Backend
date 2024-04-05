const Forum = require('../../models/forumModel')
const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')
const {
    noForumFoundError,
    youAreAlreadySubscribedToThisForumError,
    youAreBannedFromThisForumError,
} = require('../../errors/forumErrors/forumErrors')

const unsubscribeFromForum = tryCatchWrapper(async (req, res) => {
    const { forum_id: forumId } = req.body
    const id = await getCreatorIdFromHeaders(req.headers)
    const user = await User.findById(id)
    if (!user) {
        throw new noUserFoundError(id)
    }
    let forum = await Forum.findOne({ '_id.forum_id': forumId })
    if (!forum) {
        throw new noForumFoundError()
    }
    let isContains = false
    for (const user of forum.users) {
        if (user.user_id.toString() == id.toString()) {
            isContains = true
            break
        }
    }
    if (!isContains) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'You are not subscribed to this forum!',
        })
        return
    }
    if (forum._id.creator_id.toString() == id.toString()) {
        if (forum.users.length == 0) {
            await Forum.deleteOne({ '_id.forum_id': forumId })
            res.status(StatusCodes.OK).json({
                message: 'Forum deleted successfully!',
            })
            return
        } else {
            forum._id.creator_id = forum.users[0].user_id
            forum.users = forum.users.shift()
            await forum.save()
            res.status(StatusCodes.OK).json({
                message: 'Unsubscribed from forum successfully!',
            })
        }
    }
    for (const user of forum.users) {
        if (user.user_id.toString() == id.toString()) {
            forum.users.pull(user)
            await forum.save()
            res.status(StatusCodes.OK).json({
                message: 'Unsubscribed from forum successfully!',
            })
            return
        }
    }
})

module.exports = unsubscribeFromForum
