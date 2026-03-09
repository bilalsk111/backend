require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/config/database')
let PORT = 5000




connectToDB()


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})



