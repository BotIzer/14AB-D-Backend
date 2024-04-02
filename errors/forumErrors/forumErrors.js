const forumAlreadyExistsError = require('./forumAlreadyExistsError')
const noForumFoundError = require('./noForumFoundError')
const notAuthorizedToBanUsersFromForumError = require('./notAuthorizedToBanUsersFromForumError')
const userIsAlreadyBannedFromForumError = require('./userIsAlreadyBannedFromForumError')
const noForumNameGivenError = require('./noForumNameGivenError')
const notAuthorizedToDeleteForumError = require('./notAuthorizedToDeleteForumError')
const youAreNotInThisForumError = require('./youAreNotInThisForumError')

module.exports = {
    forumAlreadyExistsError,
    noForumFoundError,
    notAuthorizedToBanUsersFromForumError,
    userIsAlreadyBannedFromForumError,
    noForumNameGivenError,
    notAuthorizedToDeleteForumError,
    youAreNotInThisForumError
}
