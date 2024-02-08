const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class noForumFoundError extends CustomAPIError {
    constructor(message) {
        super('No forum found with this name: ' + message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = noForumFoundError