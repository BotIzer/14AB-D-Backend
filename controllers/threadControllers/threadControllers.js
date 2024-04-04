const createThreadController = require('./createThreadController')
const deleteThreadConroller = require('./deleteThreadController')
const likeDislikeStateChanged = require('./likeDislikeStateChangedController')
const getThreadById = require('./getThreadByIdController')

module.exports = {
    createThread: createThreadController,
    deleteThreadConroller,
    likeDislikeStateChanged,
    getThreadById,
}
