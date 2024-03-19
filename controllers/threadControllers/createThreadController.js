const Thread = require('../../models/threadModel')
const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noForumFoundError }= require('../../errors/forumErrors/forumErrors')

const createThread = tryCatchWrapper(async (req, res) => {
    const { forum_name: forumName, name: name, content: content, images: images } = req.body
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers)
    const forumId = await Forum.getForumIdByName(forumName)
    if (!forumId) {
        throw new noForumFoundError(forumName)
    }
    let newThread = new Thread({
        _id: {
            forum_id: forumId,
            creator_id: decodedCreatorId,
        },
        name: name,
        editors: decodedCreatorId,
        creation_date: Date.now(),
        content: content,
    })
    images.forEach(image => {
        newThread.image_array.push(image)
    })
    newThread.save()
    res.status(StatusCodes.CREATED).json({ success: true })
    return
})

module.exports = createThread
