const express = require('express')
const router = express.Router()
const {
    loginUser,
    registerUser: {
        registerUser,
        verifyEmail
    },
    getUsersChats,
    changePassword,
    confirmPasswordChange,
    userController: {
        getAllUsers,
        getUserDataById,
        updateUser,
        deleteUser,
        getUserInfoFromToken,
        getUserProfileByUsername,
        addHobby,
        getUserRequests,
        getUsersSentRequests,
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
const { createThread, deleteThreadConroller, likeDislikeStateChanged } = require('../controllers/threadControllers/threadControllers')
const {
    getChatDataById,
    createChat,
    checkMutualChat,
    getChatsComments,
    deleteChat,
    leaveChat
} = require('../controllers/chatControllers/chatControllers')
const { createComment, updateComment, deleteComment } = require('../controllers/commentControllers/commentControllers')
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
router.route('/verifyEmail/:emailToken').get(verifyEmail) //Swagger

router.route('/search').post(search)

router.route('/user').put(protectPath, updateUser).delete(protectPath, deleteUser)
router.route('/user/friends/requests').get(protectPath, getUserRequests)
router.route('/user/friends/sentRequests').get(protectPath, getUsersSentRequests)
router.route('/user/changePassword').post(/*protectPath, */changePassword, confirmPasswordChange)
router.route('/user/:username').get(getUserProfileByUsername)
router.route('/user/addHobby').post(protectPath, addHobby)

router.route('/forum').get(getAllForums).post(protectPath, createForum).delete(protectPath, deleteForum)
router.route('/forum/getAllThreads/:forumId').get(protectPath, checkWetherBannedFromForum, getAllThreads)
router.route('/forum/getForumsByTag/:tag').get(searchForumByTag)
router.route('/forum/ban').post(protectPath, banUserFromForum).put(protectPath, unbanUserFromForum)
router.route('/forum/:forumId').get(getForumById).put(protectPath, updateForum)

router.route('/thread').post(protectPath, createThread)
router.route('/thread/:threadId').delete(protectPath, deleteThreadConroller)
router.route('/thread/:threadId/likeDislike').post(protectPath, likeDislikeStateChanged)

router.route('/chat/:chatId/comments').get(protectPath, getChatsComments)
router.route('/chat/:chatId').get(protectPath, getChatDataById).delete(protectPath, deleteChat)
router.route('/chat/addFriend').post(protectPath, addFriendToChat)
router.route('/createOrRetrieveChat').post(protectPath, checkMutualChat)
router.route('/chat').post(protectPath, createChat)
router.route('/chat/leaveChat').post(protectPath, leaveChat)
router.route('/chats').get(protectPath, getUsersChats)

router.route('/comment').post(protectPath, createComment)
router.route('/comment/:commentId').patch(protectPath, updateComment).delete(protectPath, deleteComment)

router.route('/friends').get(protectPath, getFriends)
router.route('/friend/:friendName').post(protectPath, makeFriendRequest).delete(protectPath, deleteFriend)
router.route('/acceptFriendRequest/:requestCreatorName').post(protectPath, acceptFriendRequest)
router.route('/declineFriendRequest/:requestCreatorName').post(protectPath, declineFriendRequest)
module.exports = router
