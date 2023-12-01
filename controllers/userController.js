const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const { createCustomError } = require('../errors/customError')

const updaterOptions = {
    new: true,
    runValidators: true,
}

const getUserIdFromUrl = (params) => {
    const { userId: userId } = params
    return userId
}

const createUser = tryCatchWrapper(async (req, res) => {
    if (await User.findOne({ email: req.body.email }))
        res.status(500).json({
            message: `User already exists with this email: ${req.body.email}`,
        })
    let newUser = new User({
        email: req.body.email,
        username: req.body.username,
    })
    newUser.password = newUser.generateHash(req.body.password)
    newUser.save()
    res.status(201).json({ newUser })
})

const getAllUsers = tryCatchWrapper(async (req, res) => {
    const users = await User.find()
    res.status(200).json({ users })
})

const getUserDataById = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findById(userId)
    if (!user)
        return next(createCustomError(`No user found with id: ${userId}`, 404))
    res.status(200).json({ user })
})

const updateUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndUpdate(userId, req.body, updaterOptions)
    if (!user)
        return next(createCustomError(`No user found with id: ${userId}`, 404))
    res.status(200).json({ user })
})

const deleteUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndDelete(userId)
    if (!user)
        return next(createCustomError(`No user found with id: ${userId}`, 404))
    res.status(200).json({ user })
})

module.exports = {
    createUser,
    getAllUsers,
    getUserDataById,
    updateUser,
    deleteUser,
}
