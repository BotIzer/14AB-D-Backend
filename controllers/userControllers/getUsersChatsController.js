const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const getUsersChats = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    const chats = await User.findById(id).populate('chats').select(chats)
    if (!chats) {
        //error class needed
        req.status(404).json({ message: 'No chats found' })
    }
    req.status(200).json({ chats })
})

module.exports = getUsersChats
