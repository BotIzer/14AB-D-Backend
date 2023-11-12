const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema({
    _id: {
        creator: {
            type: ObjectId,
        },
        forum: {
            type: ObjectId,
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
    },
})

module.exports = mongoose.model('Forum', forumSchema)
