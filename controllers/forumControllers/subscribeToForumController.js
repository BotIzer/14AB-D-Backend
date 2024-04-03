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

const subscribeToForum = tryCatchWrapper(async (req, res) => {
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
    if (forum.blacklisted_users.map((user) => user.user_id.toString()).includes(id.toString())) {
        throw new youAreBannedFromThisForumError()
    }
    if (
        forum.users.map((user) => user.user_id.toString()).includes(id.toString()) ||
        forum._id.creator_id.toString() == id.toString()
    ) {
        throw new youAreAlreadySubscribedToThisForumError()
    }
    forum.users.push({ user_id: id, is_moderator: false })
    await forum.save()
    res.status(StatusCodes.OK).json({
        message: 'Forum subscribed successfully!',
    })
    return
})

module.exports = subscribeToForum