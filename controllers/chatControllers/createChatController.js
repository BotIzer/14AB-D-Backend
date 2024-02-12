const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { daysToDieError } = require('../../errors/chatErrors/daysToDieError')

const createChat = tryCatchWrapper(async (req, res) => {
    const { name: name, is_ttl: isTtl, time_to_live_days: daysToDie, is_private: isPrivate } = req.body
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers)
    let expirationDate = null
    if (isTtl) {
        if (daysToDie < 1 && !Number.isInteger(daysToDie)) {
            throw new daysToDieError()
        }
        expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + daysToDie)
    }
    let newChat = new Chat({
        name: name,
        owner: decodedCreatorId,
        time_to_live: {
            is_ttl: isTtl,
            expiration: expirationDate,
        },
        is_private: isPrivate,
    })
    newChat.save()
    let creatorUser = await User.findById(decodedCreatorId)
    creatorUser.chats.push(newChat._id)
    creatorUser.save()
    res.status(StatusCodes.CREATED).json({ roomId: newChat._id })
    return
})

module.exports = createChat
