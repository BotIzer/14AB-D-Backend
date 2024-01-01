const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const createForum = tryCatchWrapper(async (req, res) => {
    const { forum_name: forumName, banner: banner } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const {id: decodedCreatorId} = jwt.verify(token, process.env.JWT_SECRET)
    let newForum = new Forum({
        _id: {
            creator: decodedCreatorId,
        },
        forum_name: forumName,
        banner: banner,
    })
    newForum.save()
    res.status(StatusCodes.CREATED).json({ success: true })
    return
})

module.exports = createForum
