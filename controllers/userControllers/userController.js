const User = require('../../models/userModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const noUserFoundError = require('../../errors/userErrors/userErrors')
const { StatusCodes } = require('http-status-codes')
const getUserIdFromToken = require('../../middlewares/getUserIdFromToken')

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
    // const userId = getUserIdFromToken(req.headers.authorization.split(' ')[1])
    // const user = await User.findById(userId)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`)
    res.status(StatusCodes.OK).json({ user })
})

const getUserDataByToken = tryCatchWrapper(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwt.verify(token, process.env.JWT_SECRET)
    const userInformation = await User.findById(userId)
    if (!userInformation) throw new noUserFoundError('No user found')
    res.status(StatusCodes.OK).json({ userInformation })
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
    getUserDataByToken,
}
