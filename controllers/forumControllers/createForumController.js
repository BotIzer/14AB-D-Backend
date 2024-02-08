const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { forumAlreadyExistsError } = require('../../errors/forumErrors/forumErrors')

const createForum = tryCatchWrapper(async (req, res) => {
    const { forum_name: forumName, banner: banner } = req.body
    if (await Forum.findOne({forum_name: forumName}))
        throw new forumAlreadyExistsError(forumName)
    const decodedCreatorId = getCreatorIdFromHeaders(req.headers)
    let newForum = new Forum({
        _id: {
            creator_id: decodedCreatorId,
        },
        forum_name: forumName,
        banner: banner,
    })
    newForum.save()
    res.status(StatusCodes.CREATED).json({ success: true })
    return
})

module.exports = createForum
