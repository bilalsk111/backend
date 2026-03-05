const express = require('express')
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}))

const authRouter = require('./routes/auth.route')
const songrouter = require('./routes/song.route')



app.use('/api/auth',authRouter)
app.use('/api/songs',songrouter)

module.exports = app