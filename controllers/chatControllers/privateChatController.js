const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { chatShallBeCreatedError } = require('../../errors/chatErrors/chatErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const privateChat = tryCatchWrapper(async (req, res) => {
    let { friend: friendName, chat_id: chatId } = req.body
    chatId = '65ccf605e0f98a044855f299' //with a real id it'll work but for testing purposes I'll use this
    console.log(friendName)
    if (chatId) {
        if (!(await Chat.findById(chatId))) {
            throw new chatShallBeCreatedError()
        }
        const id = await getCreatorIdFromHeaders(req.headers)
        const myFriends = (await User.findById(id).select('chats -_id')).chats
        const friend = await User.findOne({ username: friendName })
        console.log(friend)
        if (friend) {
            if (myFriends.includes(friend._id)) {
                //Van közös chat
            }
        }
    }
    return
})

module.exports = privateChat
