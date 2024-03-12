const tryCatchWrapper = require("../../middlewares/tryCatchWrapper");
const User = require('../../models/userModel')
const Chat = require('../../models/chatroomModel');
const getCreatorIdFromHeaders = require("../../middlewares/getCreatorIdFromHeaders");
const leaveChat = tryCatchWrapper(async (req, res) => {
    const { chat_id: chatId } = req.body
    const decodedId = await getCreatorIdFromHeaders(req.headers)
    const user = await User.findById(decodedId)
    user.chats.pull(chatId)
    user.save()
    const chat = await Chat.findById(chatId)
    chat.users.pull({ user_id: decodedId })
    chat.save()
})

module.exports = leaveChat