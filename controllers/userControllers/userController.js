const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const noUserFoundError = require('../../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const updaterOptions = {
    new: true,
    runValidators: true,
}

const getUserIdFromUrl = (params) => {
    const { userId: userId } = params
    return userId
}

const getAllUsers = tryCatchWrapper(async (req, res) => {
    const users = await User.find()
    if (!users) {
        throw new noUserFoundError(`User already exists with this email: ${req.body.email}`)
    }
    res.status(StatusCodes.OK).json({ users })
})

const getUserDataById = tryCatchWrapper(async (req, res) => {
    const user = req.user
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`)
    res.status(StatusCodes.OK).json({ user })
})

const getUserInfoFromToken = tryCatchWrapper(async (token) => {
    const userId = jwt.verify(token, process.env.JWT_SECRET).id
    const userInformation = await User.findById(userId)
    if (!userInformation) throw new noUserFoundError('No user found')
    const userInfoObject = {
        email: userInformation.email,
        profile_image: userInformation.profile_image,
        custom_ui: userInformation.custom_ui,
        roles: userInformation.roles,
        username: userInformation.username,
        created_at: userInformation.created_at,
        full_name: userInformation.full_name,
    }
    return userInfoObject
})

const getUserProfileByUsername = tryCatchWrapper(async (req, res) => {
    const { username: username } = req.params
    const user = await User.findOne({ username: username })
    if (!user) res.status(StatusCodes.NOT_FOUND).json({message: `No user found with username: ${username}`})
    res.status(StatusCodes.OK).json({ user })
})

const updateUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndUpdate(userId, req.body, updaterOptions)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`)
    res.status(StatusCodes.OK).json({ user })
})

const deleteUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndDelete(userId)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`)
    res.status(StatusCodes.OK).json({ user })
})

module.exports = {
    getAllUsers,
    getUserDataById,
    updateUser,
    deleteUser,
    getUserInfoFromToken,
    getUserProfileByUsername,
}
