const createThreadController = require('./createThreadController')
const deleteThreadConroller = require('./deleteThreadController')
const likeDislikeStateChanged = require('./likeDislikeStateChangedController')

module.exports = {
    createThread: createThreadController,
    deleteThreadConroller,
    likeDislikeStateChanged,
}
