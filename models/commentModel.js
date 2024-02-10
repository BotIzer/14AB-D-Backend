const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    _id: {
        room: {
            type: mongoose.ObjectId,
            ref: 'Chatroom',
            required: true,
        },
        user: {
            type: mongoose.ObjectId,
            required: true,
        },
        message: {
            type: mongoose.ObjectId,
            auto: true,
        },
    },

    text: {
        type: String,
        maxlength: [2000, 'A comment cannot be longer than 2000 characters!'],
    },
    reply_id: {
        parent_comment: {
            type: mongoose.ObjectId,
        },
        sequential_number: {
            type: Number,
            default: 0,
        },
    },

    creation_date: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    emoticons: [String],
})

module.exports = mongoose.model('Comment', commentSchema, 'Comments')
