const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const {
    getAllUsers,
    createUser,
    getUserDataById,
    updateUser,
    deleteUser,
    loginTest
} = require('../controllers/userController')

router.route('/register').post(createUser)
router.route('/login').post(loginTest)

module.exports = router
