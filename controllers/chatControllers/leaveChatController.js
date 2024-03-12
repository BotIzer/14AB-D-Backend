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
    const chat = await Chat.updateOne({ _id: chatId }, { $pull: { users: { user_id: decodedId } } })
    res.status(200).json({
        success: true,
        message: 'Chat left successfully!',
        chat,
    })
})

module.exports = leaveChat