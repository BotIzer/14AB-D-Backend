const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { userDoesNotHaveChatsYetError } = require('../../errors/userErrors/userErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const getUsersChats = tryCatchWrapper(async (req, res) => {
    const id = /*await getCreatorIdFromHeaders(req.headers)*/'65ca57bf7b4f2295c385b4f2' //to sajtostaller chats sould be added!
    const chats = await User.findById(id).populate('chats').select('chats -_id')
    if (chats.chats.length === 0) {
        throw new userDoesNotHaveChatsYetError()
    }
    res.status(StatusCodes.OK).json({ chats })
    return
})

module.exports = getUsersChats
