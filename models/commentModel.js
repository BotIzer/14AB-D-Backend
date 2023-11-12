const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    _id: {
        room: {
            type: ObjectId,
            required: true,
        },
        user: {
            type: ObjectId,
            required: true,
        },
        message: {
            type: ObjectId,
            required: true,
        },
    },

    text: {
        type: String,
        max: [2000, 'A comment cannot be longer than 2000 characters!'],
    },
    reply_id: {
        parent_comment: {
            type: ObjectId,
            required: true,
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

module.exports = mongoose.model('Comment', commentSchema)
