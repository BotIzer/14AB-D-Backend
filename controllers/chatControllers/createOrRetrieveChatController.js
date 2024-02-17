const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const User = require('../../models/userModel')
const { chatShallBeCreatedError } = require('../../errors/chatErrors/chatErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { youHaveNoFriendWithThisNameError, noUserFoundError } = require('../../errors/userErrors/userErrors')

const checkMutualChat = tryCatchWrapper(async (req, res, next) => {
    const { friend: friendName } = req.body
    const myId = await getCreatorIdFromHeaders(req.headers)
    const myFriends = (await User.findById(myId).select('chats -_id')).chats
    const friend = await User.findOne({ username: friendName })

    if (!friend) {
        throw new noUserFoundError(friendName)
    }

    if (!myFriends.includes(friend._id)) {
        throw new youHaveNoFriendWithThisNameError(friendName)
    }

    // Check if mutual chat exists
    const mutualChat = await Chat.aggregate([
        {
            $match: {
                is_private: true,
                $or: [
                    { owner: myId, users: [friend._id] },
                    { owner: friend._id, users: [myId] },
                ],
            },
        },
    ])
    if (mutualChat) {
        req.mutualChat = mutualChat // Attach mutual chat to request object
    } else {
        req.friendId = friend._id // Attach friend's ID to request object
    }
    next()
})

const createOrRetrieveChatController = tryCatchWrapper(async (req, res) => {
    let { friend: friendName, chat_id: chatId } = req.body
    if (chatId) {
        if (!(await Chat.findById(chatId))) {
            throw new chatShallBeCreatedError()
        }
        const myId = await getCreatorIdFromHeaders(req.headers)
        const myFriends = (await User.findById(myId).select('chats -_id')).chats
        const searchedFriend = await User.findOne({ username: friendName })
        if (!searchedFriend) {
            throw new noUserFoundError(friendName)
        }

        if (!myFriends.includes(searchedFriend._id)) {
            throw new youHaveNoFriendWithThisNameError(friendName)
        }

        // If mutual chat exists, send its information
        console.log(req.mutualChat)
        if (req.mutualChat) {
            return res.json(req.mutualChat)
        }
    }
    throw new chatShallBeCreatedError()
    //create a chat
})

module.exports = { createOrRetrieveChatController, checkMutualChat }
