const User = require('../../models/userModel')
const Thread = require('../../models/threadModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')

const likeDislike = tryCatchWrapper(async (req, res) => {
    const threadId = req.params.threadId
    const userId = await getCreatorIdFromHeaders(req.headers)
    const user = await User.findById(userId)
    if (!user) throw new noUserFoundError(userId)
    const pressedButton = req.body.pressedButton
    const thread = await Thread.findById(threadId)
    if (!thread) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Thread not found' })
        return
    }
    if (pressedButton === 'like') {
        if (thread.likes.includes(user.username)) {
            thread.likes.users.pull(user.username)
            thread.likes.count--
            await thread.save()
            res.status(StatusCodes.OK).json({ message: 'Thread unliked' })
            return
        } else {
            thread.likes.users.push(user.username)
            thread.likes.count++
            await thread.save()
            res.status(StatusCodes.OK).json({ message: 'Thread liked' })
            return
        }
    } else if (pressedButton === 'dislike') {
        if (thread.dislikes.users.includes(user.username)) {
            thread.dislikes.users.pull(user.username)
            thread.dislikes.count--
            await thread.save()
            res.status(StatusCodes.OK).json({ message: 'Thread undisliked' })
            return
        } else {
            thread.dislikes.users.push(user.username)
            thread.dislikes.count++
            await thread.save()
            res.status(StatusCodes.OK).json({ message: 'Thread disliked' })
            return
        }
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid button pressed' })
    return
})

module.exports = likeDislike