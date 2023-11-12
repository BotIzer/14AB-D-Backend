const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
        max: [100, 'The fullname cannot be more than 100 characters!'],
        min: [5, 'The fullname cannot be less than 5 characters'],
    },
    profile_image: {
        type: String,
        default: 'default',
    },
    custom_ui: {
        type: Boolean,
        required: true,
        default: false,
    },
    roles: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        min: [2, 'Username should be at least 2 characters!'],
        max: [20, 'Username cannot be longer than 20 characters!'],
    },
    friends: {
        type: Object,
    },
    password: {
        type: String,
        required: true,
        min: [8, 'Password should be at least 8 characters!'],
    },
    contacts: {
        type: Map,
        of: String,
    },
})

module.exports = mongoose.model('User', userSchema)
