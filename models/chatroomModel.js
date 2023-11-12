const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
        unique: true,
    },
    users: {
        id: {
            type: ObjectId,
            required: true,
        },
        is_moderator: {
            type: Boolean,
            default: false,
        },
    },

    common_topics: [String],
    owner: {
        type: ObjectId,
        required: true,
    },
    time_to_live: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('Chatroom', chatroomSchema)
