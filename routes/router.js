const express = require('express')
const router = express.Router()
const { getAllUsers, getUserDataById, updateUser, deleteUser } = require('../controllers/userController')
const loginUser = require('../controllers/loginController')
const registerUser = require('../controllers/registerController')
const protectPath = require('../middlewares/protectPath')


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route(protectPath, '/loggedInPage').get()

module.exports = router
