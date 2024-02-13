const privateChatController = require('./privateChatController')
const getChatDataByIdController = require('./getChatDataByIdController')
const createChatController = require('./createChatController')

module.exports = {
    privateChat: privateChatController,
    getChatDataById: getChatDataByIdController,
    createChat: createChatController,
}
