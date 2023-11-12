const mongoose = require('mongoose')

const connectDB = (url) => {
    try {
        mongoose.connect(url, {
            // useNewUrlParser: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            // useUnifiedTopology: true,
        })
        console.log("Database is connected!");
    } catch (error) {
        console.log(error);
        
    }
    
}
module.exports = connectDB
