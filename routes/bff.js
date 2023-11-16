const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    createUser,
    getUserDataById,
    updateUser,
    deleteUser,
} = require('../controllers/userController')

router.route('/user').get(getAllUsers).post(createUser)
router.route('/user/:userId').get(getUserDataById).patch(updateUser).delete(deleteUser)

module.exports = router
