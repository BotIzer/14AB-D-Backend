const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')

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

module.exports = searchForumByTag
