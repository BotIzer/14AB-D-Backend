const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class noUserFoundError extends CustomAPIError {
    constructor(message) {
        super('No user found with: ' + message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = noUserFoundError
