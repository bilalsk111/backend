let express = require('express')
let authRouter = require('./routes/auth.routes')
let cookieParser = require('cookie-parser')
let app = express()


app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)


module.exports = app
