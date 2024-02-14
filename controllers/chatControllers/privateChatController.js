const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { chatShallBeCreatedError } = require('../../errors/chatErrors/chatErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const privateChat = tryCatchWrapper(async (req, res) => {
    let { friend: friendName, chat_id: chatId } = req.body
    friendName = 'random'
    if (chatId) { //van chat elvileg
        //leellenőriz, hogy tényleg van-e
        //van
        const id = await getCreatorIdFromHeaders(req.headers)
        const myFriends = (await User.findById(id).select('chats -_id')).chats
        const friend = await User.findOne({ username: friendName }).select('_id')
        if (friend) {
            if (myFriends.includes(friend._id)) {
                //Van közös chat
            }
        }
    }
    return
})

module.exports = privateChat
