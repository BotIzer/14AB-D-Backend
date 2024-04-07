const Forum = require('../../models/forumModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')

const search = tryCatchWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const skip = (page * 10)
    const searchKeyword = req.body.keyword
    if (!searchKeyword || searchKeyword.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'No search keyword provided',
        })
    }
    const items = []
    items.push(
        await Forum.find({
            forum_name: { $regex: searchKeyword, $options: 'i' },
        })
            .skip(skip)
            .limit(limit)
            .select('forum_name banner')
    )
    items.push(
        await User.find({
            username: { $regex: searchKeyword, $options: 'i' },
        })
            .skip(skip)
            .limit(limit)
            .select('username -_id')
    )
    res.status(StatusCodes.OK).json(items)
    return
})

module.exports = search
