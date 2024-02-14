const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { daysToDieError } = require('../../errors/chatErrors/chatErrors')

const createChat = tryCatchWrapper(async (req, res) => {
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers) /*'65ca57bf7b4f2295c385b4f2'*/
    let {
        name: name,
        is_ttl: isTtl,
        days_to_die: daysToDie,
        is_private: isPrivate,
        other_user_name: otherUserName,
    } = req.body
    const expirationDate = await setExpirationDate(isTtl, daysToDie)
    let newChat = new Chat({
        name: name,
        owner: decodedCreatorId,
        time_to_live: {
            is_ttl: isTtl,
        },
        is_private: isPrivate,
    })
    if (expirationDate != null) {
        newChat.time_to_live.expiration = expirationDate
    }
    newChat.save()

    let creatorUser = await User.findById(decodedCreatorId)
    creatorUser.chats.push(newChat._id)
    creatorUser.save()
    if (isPrivate) {
        let otherUser = await User.findOne({ username: otherUserName })
        otherUser.chats.push(newChat._id)
        otherUser.save()
        newChat.users.push({ user_id: otherUser._id, is_moderator: true })
        newChat.save()
    }
    res.status(StatusCodes.CREATED).json({ roomId: newChat._id })
    return
})

const setExpirationDate = tryCatchWrapper((ttl, daysToDie) => {
    if (ttl === true) {
        if (daysToDie < 1 && !Number.isInteger(daysToDie)) {
            throw new daysToDieError()
        }
        let expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + daysToDie)
        return expirationDate
    }
    return null
})

module.exports = createChat
