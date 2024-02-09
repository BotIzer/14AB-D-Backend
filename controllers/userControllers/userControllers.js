const loginController = require('./loginController')
const registerController = require('./registerController')
const userController = require('./userController')

module.exports = {
    loginUser: loginController,
    registerUser: registerController,
    userController: userController,
}