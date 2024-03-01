const CustomAPIError = require('../customError')
const { StatusCodes } = require('http-status-codes')

class wrongLoginDataError extends CustomAPIError {
    constructor() {
        super('Username or password is wrong!')
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = wrongLoginDataError
