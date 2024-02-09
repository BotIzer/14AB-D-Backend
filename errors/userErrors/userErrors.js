const userAlreadyExistsError = require('./userAlreadyExistsError')
const noUserFoundError = require('./noUserFoundError')
const userIsAlreadyLoggedInError = require('./userIsAlreadyLoggedInError')
const wrongLoginDataError = require('./wrongLoginDataError')

module.exports = {
    userAlreadyExistsError,
    noUserFoundError,
    userIsAlreadyLoggedInError,
    wrongLoginDataError
}