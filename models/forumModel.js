const mongoose = require('mongoose')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')

const forumSchema = new mongoose.Schema({
    _id: {
        creator_id: {
            type: mongoose.ObjectId,
            required: true,
        },
        forum_id: {
            type: mongoose.ObjectId,
            auto: true,
        },
    },
    forum_name: {
        type: String,
        required: true,
        unique: true
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    banner: {
        type: String,
        required: true,
    },
    blacklist: [mongoose.ObjectId],
    users: [
        {
            user_id: {
                type: mongoose.ObjectId,
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
        type: mongoose.ObjectId,
    },
})

forumSchema.statics.getForumIdByName = tryCatchWrapper(async function(forumName) {
    const id = await this.aggregate([
        {
            $match: { forum_name: forumName },
        },

    ])
}) //does not work yet, do not use!!

module.exports = mongoose.model('Forum', forumSchema, 'Forums')
