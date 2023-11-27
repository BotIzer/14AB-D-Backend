require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const bff = require('./routes/bff')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const noMiddlewareFound = require('./middlewares/noMiddlewareFoundError')

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    )
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/', bff)
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
