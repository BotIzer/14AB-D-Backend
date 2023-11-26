const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
    _id: {
        forum: {
            type: ObjectId,
        },
        user: {
            type: ObjectId,
        },
        thread: {
            type: ObjectId,
        },
    },
    name: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    editors: [ObjectId],
    emoticons: [String],
    creation_date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Thread', threadSchema)