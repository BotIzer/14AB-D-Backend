const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const Chat = require('../../models/chatroomModel')
const { chatShallBeCreatedError } = require('../../errors/chatErrors/chatErrors')

const privateChat = tryCatchWrapper(async (req, res) => {
    const { is_private: isPrivate, room_id: roomId } = req.body

    if (roomId && isPrivate) {
        const room = await Chat.findById(roomId)
        if (room) {
            res.status(200).json({ room })
            return
        }
        throw new chatShallBeCreatedError()
    }
    return
})

module.exports = privateChat
