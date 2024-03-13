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
        addHobby,
        getUserRequests,
    },
} = require('../controllers/userControllers/userControllers')
const protectPath = require('../middlewares/protectPath')
const checkWetherBannedFromForum = require('../middlewares/checkWetherBannedFromForum')
const {
    createForum,
    getAllThreads,
    getAllForums,
    getForumById,
    searchForumByTag,
    deleteForum,
    banUserFromForum,
    unbanUserFromForum,
    updateForum,
} = require('../controllers/forumControllers/forumControllers')
const search = require('../controllers/searchController/searchController')
const { createThread, deleteThreadConroller } = require('../controllers/threadControllers/threadControllers')
const {
    getChatDataById,
    createChat,
    checkMutualChat,
    getChatsComments,
    deleteChat,
    leaveChat
} = require('../controllers/chatControllers/chatControllers')
const { createComment } = require('../controllers/commentControllers/commentControllers')
const {
    getFriends,
    deleteFriend,
    makeFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    addFriendToChat,
} = require('../controllers/friendControllers/friendControllers')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/search').post(search)
router.route('/user').put(protectPath, updateUser).delete(protectPath, deleteUser) //DELETEUSER NOT TESTED
router.route('/user/friendRequests').get(protectPath, getUserRequests) //NOT TESTED!
router.route('/user/:username').get(getUserProfileByUsername)
router.route('/user/addHobby').post(protectPath, addHobby)
router.route('/forum').get(getAllForums).post(protectPath, createForum).delete(protectPath, deleteForum) //DELETEFORUM NOT TESTED
router.route('/forum/getAllThreads/:forumId').get(checkWetherBannedFromForum, getAllThreads)
router.route('/forum/getForumsByTag/:tag').get(searchForumByTag)
router.route('/forum/:forumId').get(getForumById).put(protectPath, updateForum) //PUT NOT TESTED!
router.route('/forum/ban').post(protectPath, banUserFromForum).put(protectPath, unbanUserFromForum) //NOT TESTED
router.route('/thread').post(protectPath, createThread)
router.route('/thread/:threadId').delete(protectPath, deleteThreadConroller) //NOT TESTED
router.route('/chat/:chatId/comments').get(protectPath, getChatsComments)
router.route('/chat/:chatId').get(protectPath, getChatDataById).delete(protectPath, deleteChat)
router.route('/chat/addFriend').post(protectPath, addFriendToChat) //NOT TESTED!
router.route('/createOrRetrieveChat').post(protectPath, checkMutualChat)
router.route('/chat').post(protectPath, createChat)
router.route('/chat/leaveChat').post(protectPath, leaveChat)
router.route('/comment').post(protectPath, createComment)
router.route('/chats').get(protectPath, getUsersChats)
router.route('/friends').get(protectPath, getFriends)
router.route('/friend/:friendName').post(protectPath, makeFriendRequest).delete(protectPath, deleteFriend)
router.route('/acceptFriendRequest/:requestCreatorName').post(protectPath, acceptFriendRequest)
router.route('/declineFriendRequest/:requestCreatorName').post(protectPath, declineFriendRequest)
module.exports = router
