const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
const { userAlreadyExistsError, noUserFoundError } = require('../errors/userErrors/userErrors')

const updaterOptions = {
    new: true,
    runValidators: true,
}

const getUserIdFromUrl = (params) => {
    const { userId: userId } = params
    return userId
}

const createUser = tryCatchWrapper(async (req, res) => {
    if (await User.findOne({ email: req.body.email })) {
        throw new userAlreadyExistsError(`User already exists with this email: ${req.body.email}`)
    }
    let newUser = new User({
        email: req.body.email,
        username: req.body.username,
    })
    newUser.password = newUser.generateHash(req.body.password)
    newUser.save()
    res.status(201).json({ newUser })
    return
})

const getAllUsers = tryCatchWrapper(async (req, res) => {
    const users = await User.find()
    if (!users) {
        throw new noUserFoundError(`User already exists with this email: ${req.body.email}`)
    }
    res.status(200).json({ users })
})

const getUserDataById = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findById(userId)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`)
    res.status(200).json({ user })
})

const updateUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndUpdate(userId, req.body, updaterOptions)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`, 404)
    res.status(200).json({ user })
})

const deleteUser = tryCatchWrapper(async (req, res) => {
    const userId = getUserIdFromUrl(req.params)
    const user = await User.findByIdAndDelete(userId)
    if (!user) throw new noUserFoundError(`No user found with id: ${userId}`, 404)
    res.status(200).json({ user })
})

const login = tryCatchWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(404).json({ message: `Username or password is wrong` })
        return
    }
    res.status(200).json({ message: 'Login was successful!' })
    return
})

module.exports = {
    createUser,
    getAllUsers,
    getUserDataById,
    updateUser,
    deleteUser,
    login,
}
