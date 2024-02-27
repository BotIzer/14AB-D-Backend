// const mongoose = require('mongoose')
// const cannotConnectToDatabaseError = require('../errors/databaseErrors/cannotConnectToDatabaseError')

// const connectDB = (url) => {
//     try {
//         mongoose.connect(url)
//         console.log('Database is connected!')
//     } catch (error) {
//         console.log(error)
//         throw new cannotConnectToDatabaseError(error)
//     }
// }
// module.exports = connectDB

const mongoose = require('mongoose')
const cannotConnectToDatabaseError = require('../errors/databaseErrors/cannotConnectToDatabaseError')

const connectDB = async (url) => {
    try {
        await mongoose.connect(url)
        console.log('Database is connected!')
    } catch (error) {
        console.error(error)
        throw new cannotConnectToDatabaseError(error)
    }
}

module.exports = connectDB
