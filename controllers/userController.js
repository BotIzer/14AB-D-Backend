const User = require('../models/userModel')

const getUserIdFromUrl = (params) => {
    const { userId: userId } = params
    return userId
}

const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({ newUser })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json({ users })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const getUserDataById = async (req, res) => {
    try {
        const user = await User.findById(getUserIdFromUrl(req.params))
        if (!user) {
            return res.status(404).json({
                msg: `No user found with id: ${getUserIdFromUrl(req.params)}`,
            })
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            getUserIdFromUrl(req.params),
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
        if (!user) {
            return res.status(404).json({
                msg: `No user found with id: ${getUserIdFromUrl(req.params)}`,
            })
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(getUserIdFromUrl(req.params))
        if (!user) {
            return res.status(404).json({
                msg: `No user found with id: ${getUserIdFromUrl(req.params)}`,
            })
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserDataById,
    updateUser,
    deleteUser,
}
