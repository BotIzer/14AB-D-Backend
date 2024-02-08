const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class noPermissionToUsePathError extends CustomAPIError {
    constructor(message) {
        super('You have no permission to use path: ' + message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = noPermissionToUsePathError
