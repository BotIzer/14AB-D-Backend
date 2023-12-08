const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class userAlreadyExistsError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.CONFLICT
    }
}

module.exports = userAlreadyExistsError