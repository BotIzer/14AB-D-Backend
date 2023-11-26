const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    createUser,
    getUserDataById,
    updateUser,
    deleteUser,
} = require('../controllers/userController')


router.route('/register').post(createUser)

module.exports = router
