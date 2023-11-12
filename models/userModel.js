const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        max: [100, 'The fullname cannot be more than 100 characters!'],
        min: [5, 'The fullname cannot be less than 5 characters'],
        trim: true,
    },
    profile_image: {
        type: String,
        default: 'default',
        trim: true,
    },
    custom_ui: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: String,
        default: 'u',
        trim: true,
    },
    username: {
        type: String,
        required: true,
        min: [2, 'Username should be at least 2 characters!'],
        max: [20, 'Username cannot be longer than 20 characters!'],
        trim: true,
    },
    friends: [mongoose.ObjectId],
    password: {
        type: String,
        required: true,
        min: [8, 'Password should be at least 8 characters!'],
        trim: true,
    },
    contacts: {
        type: Map,
        of: String,
    },
})

module.exports = mongoose.model('User', userSchema, 'Users')
