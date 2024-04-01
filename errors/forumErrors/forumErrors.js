const forumAlreadyExistsError = require('./forumAlreadyExistsError')
const noForumFoundError = require('./noForumFoundError')
const notAuthorizedToBanUsersFromForumError = require('./notAuthorizedToBanUsersFromForumError')
const userIsAlreadyBannedFromForumError = require('./userIsAlreadyBannedFromForumError')
const noForumNameGivenError = require('./noForumNameGivenError')
const notAuthorizedToDeleteForumError = require('./notAuthorizedToDeleteForumError')

module.exports = {
    forumAlreadyExistsError,
    noForumFoundError,
    notAuthorizedToBanUsersFromForumError,
    userIsAlreadyBannedFromForumError,
    noForumNameGivenError,
    notAuthorizedToDeleteForumError
}
