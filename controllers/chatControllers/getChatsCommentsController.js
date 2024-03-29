const Chat = require('../../models/chatroomModel')
const Comment = require('../../models/commentModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { noChatFoundError } = require('../../errors/chatErrors/chatErrors')
const mongoose = require('mongoose')

const getChatsComments = tryCatchWrapper(async (req, res) => {
    const chat = await Chat.findById(req.params.chatId)
    if (!chat) {
        throw new noChatFoundError(req.params.chatId)
    }
    const comments = await Comment.aggregate([
        {
            $match: {
                '_id.room_id': new mongoose.Types.ObjectId(chat._id),
            },
        },
        {
            $lookup: {
                from: 'Users',
                localField: '_id.creator_id',
                foreignField: '_id',
                as: 'creator',
            },
        },
        {
            $addFields: {
                creator: { $arrayElemAt: ['$creator', 0] },
            },
        },
        {
            $addFields: {
                creator_name: '$creator.username',
            },
        },
        {
            $project: {
                creator: 0,
                _id: {
                    creator_id: 0
                },
            },
        },
    ])
    res.status(StatusCodes.OK).json({ comments })
    return
})

module.exports = getChatsComments
