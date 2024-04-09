const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const {
    youCannotEditThisFieldError,
    forumNameTooLongError,
    forumNameIsTooShortError,
    forumDescriptionIsTooLongError,
} = require('../../errors/forumErrors/forumErrors')

const updateForum = tryCatchWrapper(async (req, res) => {
    const userId = await getCreatorIdFromHeaders(req.headers)
    const isOwner = Forum.exists({ '_id.creator_id': userId, '_id.forum_id': req.params.forumId })
    if (!isOwner) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `You have no forum with id: ${req.params.forumId}`,
        })
        return
    }
    if (req.body.forum_name) {
        if (req.body.forum_name.length > 40) {
            throw new forumNameTooLongError()
        } else if (req.body.forum_name.length < 4) {
            throw new forumNameIsTooShortError()
        }
    }
    if (req.body.description && req.body.description.length > 5000) {
        throw new forumDescriptionIsTooLongError()
    }
    if (req.body._id) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.creator_id) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.creation_date) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.blacklist) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.users) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.rating) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.topthread) {
        throw new youCannotEditThisFieldError()
    }
    if (req.body.tags) {
        await Forum.updateOne({ '_id.forum_id': req.params.forumId }, { $addToSet: { tags: { $each: req.body.tags } } })
    }
    await Forum.updateOne({ '_id.forum_id': req.params.forumId }, req.body)
    res.status(StatusCodes.OK).json({
        message: 'Forum updated',
    })
})

module.exports = updateForum
