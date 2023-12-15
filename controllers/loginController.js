const User = require('../models/userModel')
const tryCatchWrapper = require('../middlewares/tryCatchWrapper')

const loginUser = tryCatchWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validPassword(user, req.body.password)) {
        res.status(404).json({ message: `Username or password is wrong` })
        return
    }
    res.status(200).json({ message: 'Login was successful!' })
    return
})

module.exports = loginUser