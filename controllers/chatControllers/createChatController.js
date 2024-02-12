const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { daysToDieError } = require('../../errors/chatErrors/daysToDieError')

const createChat = tryCatchWrapper(async (req, res) => {
    const {
        name: name,
        is_ttl: isTtl,
        time_to_live_days: daysToDie,
        is_private: isPrivate,
        other_user_name: otherUserName,
    } = req.body
    //If those 2 users already have the private chat, don't create another one should be implemented!
    //MEG KÉNE OLDANI 1 CONTROLLERREL AMI 2 FELÉ ÁGAZIK EL, DE AHHOZ NEKEM BELE KELL NYÚLNOM A FORONTENDBE
    const decodedCreatorId = await getCreatorIdFromHeaders(req.headers)
    let expirationDate = setExpirationDate(isTtl, daysToDie)
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
    if (isPrivate) {
        let otherUser = await User.findOne({ username: otherUserName })
        otherUser.chats.push(newChat._id)
        otherUser.save()
    }
    res.status(StatusCodes.CREATED).json({ roomId: newChat._id })
    return
})

const setExpirationDate = tryCatchWrapper((ttl, daysToDie) => {
    if (ttl) {
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
