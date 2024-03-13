const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const Chatroom = require('../../models/chatroomModel')

const getFriends = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const friendIds = await User.findById(id).select('friends -_id')
    if (!friendIds) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No friends found' })
    }
    const friends = []
    for (const id of friendIds.friends) {
        const friend = await User.findById(id)
        friends.push({
            username: friend.username,
        })
    }
    res.status(StatusCodes.OK).json(friends)
    return
})

const deleteFriend = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const friend = await User.findOne({ username: req.params.friendName })
    if (!friend) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No friend found!' })
    }
    const deletersProfile = await User.findById(id)
    deletersProfile.friends.pull(friend._id)
    await deletersProfile.save()
    friend.friends.pull(id)
    await friend.save()
    res.status(StatusCodes.OK).json({ message: 'Friend deleted' })
    return
})

const makeFriendRequest = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const sender = await User.findById(id)
    const user = await User.findOne({ username: req.params.friendName })
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found to send friend request to!' })
    }
    user.friend_requests.push(sender.username)
    await user.save()
    sender.sent_friend_requests.push(user.username)
    await sender.save()
    res.status(StatusCodes.OK).json({ message: 'Friend request sent' })
    return
})

const acceptFriendRequest = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const accepter = await User.findById(id)
    const friend = await User.findOne({ username: req.params.requestCreatorName })

    accepter.friends.push(friend._id)
    accepter.friend_requests.pull(req.params.requestCreatorName)
    await accepter.save()
    friend.sent_friend_requests.pull(accepter.username)
    friend.friends.push(accepter._id)
    await friend.save()
    res.status(StatusCodes.OK).json({ message: 'Friend request accepted' })
    return
})

const declineFriendRequest = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const decliner = await User.findById(id)
    decliner.friend_requests.pull(req.params.requestCreatorName)
    await decliner.save()
    const requester = await User.findOne({ username: req.params.requestCreatorName })
    requester.sent_friend_requests.pull(decliner.username)
    await requester.save()
    res.status(StatusCodes.OK).json({ message: 'Friend request declined' })
    return
})

const addFriendToChat = tryCatchWrapper(async (req, res) => {
    const { friend_name: friendName, chat_id: chatId } = req.body
    const id = await getCreatorIdFromHeaders(req.headers)
    const adder = await User.findById(id)
    const friend = await User.findOne({ username: friendName })
    if (!friend) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found with name: ' + friendName })
    }
    const chat = await Chatroom.findById(chatId)
    if (!chat) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No chat found!' })
    }
    adder.friends.forEach(async (addersFriend) => {
        if (addersFriend == friend._id) {
            chat.users.push({
                user_id: friend._id,
                is_moderator: false,
            })
            await chat.save()
            friend.chats.push(chat._id)
            await friend.save()
            res.status(StatusCodes.OK).json({ message: 'Friend added to chat' })
            return
        }
    })
    res.status(StatusCodes.NOT_FOUND).json({ message: 'You have no friend with name: ' + friendName })
    return
})

module.exports = { getFriends, deleteFriend, makeFriendRequest, acceptFriendRequest, declineFriendRequest, addFriendToChat }
