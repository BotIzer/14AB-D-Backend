const loginController = require('./loginController')
const registerController = require('./registerController')
const userController = require('./userController')
const getUsersChatsController = require('./getUsersChatsController')

module.exports = {
    loginUser: loginController,
    registerUser: registerController,
    userController: userController,
    getUsersChats: getUsersChatsController,
}