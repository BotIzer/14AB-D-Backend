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
const User = require('./models/userModel')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(xss())
app.use(helmet({
    crossOriginResourcePolicy: false,
}))
const limiter = rateLimit({
    windowMs: 1000,         // 1000 ms = 1 second
    max: 100,
})
app.use(limiter)
app.use(hpp())
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
        commentChangeStream.on('change', async (change) => {
            // Emit the change to connected clients
            io.emit('commentChange', change)
            // console.log(await createEmitResponse(change))
            io.emit('message', await createEmitResponse(change))
        })
        // Start the server after MongoDB connection is established
        server.listen(port, () => console.log(`Server is listening on port: ${port}...`))
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

// Socket.IO logic
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})
// Start the server
startServer()

const createEmitResponse = async (change) => {
    return {
        _id: { message_id: change.fullDocument._id.message_id, room_id: change.fullDocument._id.room_id },
        text: change.fullDocument.text,
        reply: change.fullDocument.reply,
        likes: change.fullDocument.likes,
        diskiles: change.fullDocument.diskiles,
        emoticons: change.fullDocument.emotions,
        creation_date: change.fullDocument.creation_date,
        creator_name: (await User.findById(change.fullDocument._id.creator_id).select('username -_id')).username,
    }
}
