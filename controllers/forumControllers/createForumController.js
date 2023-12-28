// const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');

const createForum = tryCatchWrapper(async (req, res) => {
    // const { creator, forumName, banner } = req.body
    // let newForum = new Forum({
    //     _id: {
    //         creator: creator,
    //     },
    //     forum_name: forumName,
    //     banner: banner,
    // })
    // newForum.save()
    const token = req.headers.authorization.split(' ')[1]
    const {id: decoded} = jwt.verify(token, process.env.JWT_SECRET)
    console.log(token)
    res.status(200).json({ success: true })
    // return
})

module.exports = createForum
