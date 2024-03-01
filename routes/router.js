const express = require('express')
const router = express.Router()
const {
    loginUser,
    registerUser,
    getUsersChats,
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
const {
    getChatDataById,
    createChat,
    checkMutualChat,
    getChatsComments,
    deleteChat,
} = require('../controllers/chatControllers/chatControllers')
const { createComment } = require('../controllers/commentControllers/commentControllers')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/search').post(search)
router.route('/user').put(protectPath, updateUser).delete(protectPath, deleteUser)
router.route('/user/:username').get(getUserProfileByUsername)
router.route('/forum').post(protectPath, createForum)
router.route('/thread').post(protectPath, createThread)
router.route('/chat/:chatId/comments').get(protectPath, getChatsComments)
router.route('/chat/:chatId').get(protectPath, getChatDataById)
router.route('/createOrRetrieveChat').post(protectPath, checkMutualChat)
router.route('/chat').post(protectPath, createChat)
router.route('/chat/:chatId').delete(protectPath, deleteChat)
router.route('/comment').post(protectPath, createComment)
router.route('/chats').get(protectPath, getUsersChats)

module.exports = router
