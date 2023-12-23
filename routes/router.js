const express = require('express')
const router = express.Router()
const { getAllUsers, getUserDataById, updateUser, deleteUser } = require('../controllers/userController')
const loginUser = require('../controllers/loginController')
const registerUser = require('../controllers/registerController')


router.route('/register').post(registerUser)
router.route('/login').post(loginUser) //session-ökkel https://www.youtube.com/watch?v=zsOGmMuwhT4&t=200s

module.exports = router
