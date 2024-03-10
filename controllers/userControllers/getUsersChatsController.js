const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { userDoesNotHaveChatsYetError } = require('../../errors/userErrors/userErrors')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')

const getUsersChats = tryCatchWrapper(async (req, res) => {
    const id = await getCreatorIdFromHeaders(req.headers)
    let chats = await User.findById(id).populate('chats').select('chats -_id')
    if (!chats) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `No user found with this id: '${id}'`,
        })
    }
    const myName = (await User.findById(id)).username
    console.log(myName);
    if (!chats) {
        throw new userDoesNotHaveChatsYetError()
    }
    const privateChats = []
    const publicChats = []

    for (const element of chats.chats) {
        if (element.is_private) {
            privateChats.push({
                _id: element._id,
                name: element.name,
                is_private: element.is_private,
                friend_user_name:
                    (await User.findById(element.users[0].user_id)).username != myName
                        ? (await User.findById(element.users[0].user_id)).username
                        : (await User.findById(element.owner)).username,
            })
        } else {
            publicChats.push({
                _id: element._id,
                name: element.name,
                is_private: element.is_private,
            })
        }
    }
    const returnArray = privateChats.concat(...publicChats)
    res.status(StatusCodes.OK).json({ returnArray })
    return
})

module.exports = getUsersChats
