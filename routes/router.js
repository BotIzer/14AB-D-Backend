const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    registerUser,
    getUserDataById,
    updateUser,
    deleteUser,
} = require('../controllers/userController')
const loginUser = require('../controllers/loginController');

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

module.exports = router
