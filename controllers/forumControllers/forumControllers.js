const Forum = require('../../models/forumModel')
const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { forumAlreadyExistsError } = require('../../errors/forumErrors/forumErrors')
const Thread = require('../../models/threadModel')
const mongoose = require('mongoose')


const createForum = tryCatchWrapper(async (req, res) => {
    const { forum_name: forumName, banner: banner } = req.body
    if (!forumName) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Please provide a forum name',
        })
        return
    }
    if (await Forum.findOne({ forum_name: forumName })) throw new forumAlreadyExistsError(forumName)
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers)
    let newForum = new Forum({
        _id: {
            creator_id: decodedCreatorId,
        },
        forum_name: forumName,
        banner: banner,
    })
    newForum.save()
    res.status(StatusCodes.CREATED).json({ success: true, forumId: newForum._id.forum_id})
    return
})

const getAllThreads = tryCatchWrapper(async (req, res) => {
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

const getAllForums = tryCatchWrapper(async (req, res) => {
    const forums = await Forum.find()
    if (!forums) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forums found',
        })
        return
    }
    res.status(StatusCodes.OK).json(forums)
    return
})
const getForumById = tryCatchWrapper(async (req, res) => {
    const forum = await Forum.findOne({ '_id.forum_id': req.params.forumId })
    if (!forum) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forum found',
        })
        return
    }
    res.status(StatusCodes.OK).json([forum])
    return
})
const searchForumByTag = tryCatchWrapper(async (req, res) => {
    const forums = await Forum.find({ tags: req.params.tag })
    if (!forums) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forums found',
        })
        return
    }
    res.status(StatusCodes.OK).json(forums)
    return
})

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

const banUserFromForum = tryCatchWrapper(async (req, res) => {
    const forum = await Forum.findOne({ '_id.forum_id': req.body.forum_id })
    if (!forum) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forum found',
        })
        return
    }
    const bannerId = await getCreatorIdFromHeaders(req.headers)
    if (bannerId != forum._id.creator_id.toString() && (await User.findById(bannerId).roles) != 'admin') {
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

const unbanUserFromForum = tryCatchWrapper(async (req, res) => {
    const forum = await Forum.findOne({ '_id.forum_id': req.body.forum_id })
    if (!forum) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'No forum found',
        })
        return
    }
    const unbannerId = await getCreatorIdFromHeaders(req.headers)
    if (unbannerId != forum._id.creator_id.toString() && (await User.findById(unbannerId).roles) != 'admin') {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are not authorized to unban users from this forum',
        })
        return
    }
    const userName = req.body.user_name
    const userId = ((await User.findOne({ username: userName }))._id).toString()
    if (!forum.blacklist.includes(userId)) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'User is not banned from this forum',
        })
        return
    }
    forum.blacklist.splice(forum.blacklist.indexOf(userId), 1)
    await forum.save()
    res.status(StatusCodes.OK).json({
        message: 'User unbanned from forum',
    })
})

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

module.exports = {
    createForum,
    getAllThreads,
    getAllForums,
    getForumById,
    searchForumByTag,
    deleteForum,
    banUserFromForum,
    unbanUserFromForum,
    updateForum,
}
