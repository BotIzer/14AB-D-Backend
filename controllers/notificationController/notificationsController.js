const createNotification = require('./createNotificationController')
const getUsersNotifications = require('./getUsersNotificationsController')
const deleteNotification = require('./deleteNotificationController')

module.exports = {
    createNotification,
    getUsersNotifications,
    deleteNotification
}