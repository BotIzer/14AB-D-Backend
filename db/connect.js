const mongoose = require('mongoose')

const connectDB = (url) => {
    try {
        mongoose.connect(url)
        console.log("Database is connected!");
    } catch (error) {
        console.log(error);
        
    }
    
}
module.exports = connectDB
