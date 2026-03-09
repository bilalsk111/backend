const express = require('express')
let authRouter = require('./routes/auth.route')
let postRouter = require('./routes/post.route')
let cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())


app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)






module.exports = app