const createThreadController = require('./createThreadController')
const deleteThreadConroller = require('./deleteThreadController')
const likeDislikeStateChanged = require('./likeDislikeStateChangedController')
const getThreadById = require('./getThreadByIdController')
const updateThread = require('./updateThreadController')

module.exports = {
    createThread: createThreadController,
    deleteThreadConroller,
    likeDislikeStateChanged,
    getThreadById,
    updateThread
}
