require('dotenv').config()
const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express()
const router = require('./routes/router')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const noMiddlewareFound = require('./middlewares/noMiddlewareFoundError')

app.use(cookieParser())
app.use(express.json())
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(morgan('dev'))
app.use('/', router)
app.use(noMiddlewareFound)
app.use(errorHandlerMiddleware)
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
