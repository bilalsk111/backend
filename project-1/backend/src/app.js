let express = require('express')
let cookieParser = require('cookie-parser')
let cors = require('cors')

let app = express()

app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))

app.use(express.json())
app.use(cookieParser())

let authRouter = require('./routes/auth.routes')
let postRouter = require('./routes/post.routes')
let userRouter = require('./routes/user.routes')

app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)
app.use('/api/users',userRouter)

module.exports = app
