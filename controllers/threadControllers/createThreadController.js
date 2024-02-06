const Thread = require('../../models/threadModel')
const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const createThread = tryCatchWrapper(async (req, res) => {
    const { forum_name: forumName, name: name, content: content } = req.body
    const decodedCreatorId = getCreatorIdFromHeaders(req.headers)
    const forumId = await Forum.getForumIdByName(forumName)

    console.log(forumId)
    let newThread = new Thread({
        _id: {
            forum_id: forumId,
            creator_id: decodedCreatorId,
        },
        name: name,
        content: content,
        editors: decodedCreatorId,
        creation_date: Date.now(),
    })
    newThread.save()
    res.status(StatusCodes.CREATED).json({ success: true })
    return
})

module.exports = createThread
