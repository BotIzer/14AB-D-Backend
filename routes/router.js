const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    getUserDataById,
    updateUser,
    deleteUser,
    getUserInfoFromToken,
    getUserProfileByUsername,
} = require('../controllers/userControllers/userController')
const loginUser = require('../controllers/userControllers/loginController')
const registerUser = require('../controllers/userControllers/registerController')
const protectPath = require('../middlewares/protectPath')
const createForum = require('../controllers/forumControllers/createForumController')
const deleteToken = require('../middlewares/deleteToken')
const search = require('../controllers/searchController/searchController')
const createThread = require('../controllers/threadControllers/createThreadController')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/getUserInfo').get(protectPath, getUserInfoFromToken)
router.route('/logout').post(deleteToken)
router.route('/user').post(protectPath, getUserDataById)
router.route('/user/:username').get(getUserProfileByUsername)
router.route('/forum/create').post(protectPath, createForum)
router.route('/search').post(search)
router.route('/thread/create').post(protectPath, createThread)
module.exports = router
