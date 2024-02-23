const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { daysToDieError, usersAlreadyHaveMutualPrivateChatroomError } = require('../../errors/chatErrors/chatErrors')

const createChat = tryCatchWrapper(async (req, res) => {
    let {
        name: name,
        is_ttl: isTtl,
        days_to_die: daysToDie,
        is_private: isPrivate,
        other_user_name: otherUserName,
    } = req.body
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers) /*'65ca57bf7b4f2295c385b4f2'*/
    let otherUser = await User.findOne({ username: otherUserName })
    if (hasMutualPrivateChat(decodedCreatorId, otherUser._id)) {
        throw new usersAlreadyHaveMutualPrivateChatroomError()
    }
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
    console.log(creatorUser)
    creatorUser.chats.push(newChat._id)
    creatorUser.save()
    if (isPrivate) {
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

const hasMutualPrivateChat = tryCatchWrapper(async (decodedCreatorId, otherUserId) => {
    const myChats = (await User.findById(decodedCreatorId).select('chats -_id')).chats
    const otherChats = (await User.findById(otherUserId).select('chats -_id')).chats

    console.log(myChats)
    console.log(otherChats)
    for (const chatId of myChats) {
        if (otherChats.includes(chatId)) {
            return true
        }
    }
    return false
})

module.exports = createChat
