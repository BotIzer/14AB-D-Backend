const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { chatShallBeCreatedError, noChatFoundError } = require('../../errors/chatErrors/chatErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { youHaveNoFriendWithThisNameError, noUserFoundError } = require('../../errors/userErrors/userErrors')

const createOrRetrieveChatController = tryCatchWrapper(async (req, res) => {
    let { friend: friendName, chat_id: chatId } = req.body
    if (chatId) {
        if (!(await Chat.findById(chatId))) {
            throw new chatShallBeCreatedError()
        }
        const myId = await getCreatorIdFromHeaders(req.headers)
        const myFriends = (await User.findById(myId).select('chats -_id')).chats
        const user = await User.findOne({ username: friendName })
        friendName = 'Sanyika'
        if (user) {
            if (myFriends.includes(friend._id)) {
                //Van közös chat
            }
            else {
                throw new youHaveNoFriendWithThisNameError(friendName)
            }
        }
        else {
            throw new noUserFoundError(friendName)
        }
    }
    throw new noChatFoundError(chatId)
})

module.exports = createOrRetrieveChatController
