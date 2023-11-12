const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema({
    _id: {
        creator: {
            type: ObjectId,
            required: true,
        },
        forum: {
            type: ObjectId,
            required: true,
        },
    },
    forum_name: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    banner: {
        type: String,
        required: true,
    },
    blacklist: [ObjectId],
    users: [
        {
            user_id: {
                type: ObjectId,
                required: true,
            },
            is_moderator: {
                type: Boolean,
                default: false,
            },
        },
    ],
    rating: {
        type: Number,
        default: 0,
    },
    tags: [String],
    topthread: {
        type: ObjectId,
        required: true,
    },
})

module.exports = mongoose.model('Forum', forumSchema)
