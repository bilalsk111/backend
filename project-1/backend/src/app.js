let express = require('express')
let cookieParser = require('cookie-parser')
let authRouter = require('./routes/auth.routes')
let postRouter = require('./routes/post.routes')
let app = express()


app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)







module.exports = app