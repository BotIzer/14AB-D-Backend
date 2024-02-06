const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
    _id: {
        forum_id: {
            type: mongoose.ObjectId,
            required: true
        },
        creator_id: {
            type: mongoose.ObjectId,
            required: true
        },
        thread_id: {
            type: mongoose.ObjectId,
            auto: true
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
    editors: [mongoose.ObjectId],
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

module.exports = mongoose.model('Thread', threadSchema, 'Threads')
