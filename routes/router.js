const express = require('express')
const router = express.Router()
const {
    loginUser,
    registerUser,
    userController: {
        getAllUsers,
        getUserDataById,
        updateUser,
        deleteUser,
        getUserInfoFromToken,
        getUserProfileByUsername,
    },
} = require('../controllers/userControllers/userControllers')
const protectPath = require('../middlewares/protectPath')
const { createForum } = require('../controllers/forumControllers/forumControllers')
const search = require('../controllers/searchController/searchController')
const { createThread } = require('../controllers/threadControllers/threadControllers')
const { createChat, getChatDataById } = require('../controllers/chatControllers/chatControllers')
const { createComment } = require('../controllers/commentControllers/commentControllers')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/getUserInfo').get(protectPath, getUserInfoFromToken)
router.route('/search').post(search)
router.route('/user').post(protectPath, getUserDataById)
router.route('/user/:username').get(getUserProfileByUsername)
router.route('/forum/create').post(protectPath, createForum)
router.route('/thread/create').post(protectPath, createThread)
router.route('/chat/:chatId').get(protectPath, getChatDataById)
router.route('/chat/create').post(protectPath, createChat)
router.route('/comment/createComment').post(protectPath, createComment)

module.exports = router
