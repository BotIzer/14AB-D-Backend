const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    _id: {
        chatroom: {
            type: ObjectId,
        },
        user: {
            type: ObjectId,
        },
        message: {
            type: ObjectId,
        },
        is_reply: {
            type: Boolean,
            default: false,
        },
        reply: {
            type: Number,
            default: 0,
        },
    },
    text: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    emoticons: [String],
})

module.exports = mongoose.model('Message', messageSchema)
