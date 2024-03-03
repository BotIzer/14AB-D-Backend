const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const getCreatorIdFromHeaders = require('./getCreatorIdFromHeaders')
const Forum = require('../models/forumModel')

const checkWetherBannedFromForum = tryCatchWrapper(async(req, res, next) => {
    const forumId = req.params.forumId
    const userId = getCreatorIdFromHeaders(req.headers)
    const forum = await Forum.findById(forumId)
    if (forum.blacklist.includes(userId)) {
        res.status(403).json({ message: 'You are banned from this forum!' })
        return
    }
    next()
})

module.exports = checkWetherBannedFromForum