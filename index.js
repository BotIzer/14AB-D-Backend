require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const http = require('http')
const socketIo = require('socket.io')
const connectDB = require('./db/connect')
const Comment = require('./models/commentModel')
const router = require('./routes/router')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const noMiddlewareFound = require('./middlewares/noMiddlewareFoundError')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(cookieParser())
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/', router)
app.use(noMiddlewareFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const startServer = async () => {
    try {
        await connectDB(process.env.DB)
        console.log('MongoDB connected')
        // Set up MongoDB change stream for Comments collection
        const commentChangeStream = Comment.watch()
        // Start listening to changes in the Comments collection
        commentChangeStream.on('change', (change) => {
            console.log('Change detected in Comments collection:', change)
            // Emit the change to connected clients
            io.emit('commentChange', change)
        })
        // Start the server after MongoDB connection is established
        server.listen(port, () => console.log(`Server is listening on port: ${port}...`))
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

// Start the server
startServer()

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected')

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})
