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
// TODO: Change this origin.
app.use(cors({ origin: 'https://blitzforfriends.vercel.app/', credentials: true }))
app.use(express.urlencoded({extended: true}))

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
