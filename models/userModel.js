const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        maxlength: [100, 'The fullname cannot be more than 100 characters!'],
        minlength: [5, 'The fullname cannot be less than 5 characters'],
        trim: true,
        match: [
            /(^[a-zA-ZÖÜÓÚŐŰÁÉÍöüóőúűáéí\-\']{0,20}[a-zA-ZÖÜÓÚŐŰÁÉÍöüóőúűáéí\-\']{2,20}\s[a-zA-ZÖÜÓÚŐŰÁÉÍöüóőúűáéí]{2,20}[\sa-zA-ZÖÜÓÚŐŰÁÉÍöüóőúűáéí\-\']{0,20}$)/,
            'Add a valid name!',
        ],
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
        enum: [
            'u',
            'o',
            'm'
        ]
    },
    username: {
        type: String,
        required: true,
        minlength: [2, 'Username should be at least 2 characters!'],
        maxlength: [20, 'Username cannot be longer than 20 characters!'],
        trim: true,
    },
    friends: [mongoose.ObjectId],
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password should be at least 8 characters!'],
        trim: true,
        match: [
            /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
            'Strong password is required! (Min. 8 characters long, contains uppercase and lowercase letters, spec. character and numerals)'
        ]
    },
    contacts: {
        type: Map,
        of: String,
    },
})

module.exports = mongoose.model('User', userSchema, 'Users')
