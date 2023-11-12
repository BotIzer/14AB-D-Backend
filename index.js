require('dotenv').config()
const express = require('express')
const app = express()
const bff = require('./routes/bff')
const connectDB = require('./db/connect')

app.use(express.json())

//routes

app.use('/apitest', bff)

const port = 3000

const start = async () => {
    try {
        await connectDB(process.env.DB)
        app.listen(port, console.log(`Server is listening on port: ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()