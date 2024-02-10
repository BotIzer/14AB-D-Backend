const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true,
    },
    users: [
        {
            user_id: {
                type: mongoose.ObjectId,
                required: true,
            },
            is_moderator: {
                type: Boolean,
                default: false,
            },
        },
    ],
    common_topics: [String],
    owner: {
        type: mongoose.ObjectId,
        required: true,
    },
    time_to_live: {
        is_ttl: {
            type: Boolean,
            required: true,
        },
        expiration: {
            type: Date,
            default: null,
        },
    },
})

chatroomSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: '_id.room',
    justOne: false,
})

module.exports = mongoose.model('Chatroom', chatroomSchema, 'Chatrooms')
