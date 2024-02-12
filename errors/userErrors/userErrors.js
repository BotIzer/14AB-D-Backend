const userAlreadyExistsError = require('./userAlreadyExistsError')
const noUserFoundError = require('./noUserFoundError')
const userIsAlreadyLoggedInError = require('./userIsAlreadyLoggedInError')
const wrongLoginDataError = require('./wrongLoginDataError')
const noPermissionToUsePathError = require('./noPermissionToUsePathError')

module.exports = {
    userAlreadyExistsError,
    noUserFoundError,
    userIsAlreadyLoggedInError,
    wrongLoginDataError,
    noPermissionToUsePathError,
}