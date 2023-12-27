const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')
require('dotenv').config()

const updaterOptions = {
    new: true,
    runValidators: true,
}

const loginUser = tryCatchWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(404).json({ message: `Username or password is wrong` })
        return
    }

    const token = user.getSignedJwtToken()

    res.status(200).json({ message: 'Login was successful!', token: token })
    return
})

module.exports = loginUser
