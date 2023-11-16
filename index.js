require('dotenv').config()
const express = require('express')
const app = express()
const bff = require('./routes/bff')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const noMiddlewareFound = require('./middlewares/noMiddlewareFoundError')

app.use(express.json())


app.use('/apitest', bff)
app.use(errorHandlerMiddleware)
app.use(noMiddlewareFound)
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
