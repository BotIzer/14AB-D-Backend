const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class noPermissionToUsePathError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = noPermissionToUsePathError
