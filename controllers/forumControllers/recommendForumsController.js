const Forum = require('../../models/forumModel')
const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const { StatusCodes } = require('http-status-codes')

const recommendForums = tryCatchWrapper(async (req, res) => {
    let numberOfForums = req.query.numberOfForums || 5
    const numberOfDocuments = await Forum.countDocuments()
    if (numberOfDocuments < numberOfForums) {
        numberOfForums = numberOfDocuments
    }
    const randomForums = []
    for (let i = 0; i < numberOfForums; i++) {
        const randomNumber = Math.floor(Math.random() * numberOfForums)
        randomForums.push(await Forum.findOne().skip(randomNumber).limit(1))
    }
    return res.status(StatusCodes.OK).json(randomForums)
})

module.exports = recommendForums
