const express = require('express')
const router = express.Router()
const { getAllUsers, getUserDataById, updateUser, deleteUser } = require('../controllers/userControllers/userController')
const loginUser = require('../controllers/userControllers/loginController')
const registerUser = require('../controllers/userControllers/registerController')
const protectPath = require('../middlewares/protectPath')


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

module.exports = router
