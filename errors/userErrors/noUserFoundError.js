const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class NoUserFound extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
}

module.exports = NoUserFound