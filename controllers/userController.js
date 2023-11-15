const User = require('../models/userModel')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/customError')

const updaterOptions = {
    new: true,
    runValidators: true,
}

const getUserIdFromUrl = (params) => {
    const { userId: userId } = params
    return userId
}

const createUser = asyncWrapper(async (req, res) => {
    const newUser = await User.create(req.body)
    res.status(201).json({ newUser })
})

const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find()
    res.status(200).json({ users })
})

const getUserDataById = asyncWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findById(userId)
    if (!user)
        return next(createCustomError(`No user found with id: ${userId}`, 404))
    res.status(200).json({ user })
})

const updateUser = asyncWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndUpdate(userId, req.body, updaterOptions)
    if (!user)
        return next(createCustomError(`No user found with id: ${userId}`, 404))
    res.status(200).json({ user })
})

const deleteUser = asyncWrapper(async (req, res) => {
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
