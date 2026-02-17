require('dotenv').config()
let app = require('./src/app')
let connecToDB = require('./src/config/database')
let PORT = 3000



connecToDB()


app.listen(PORT,()=>{
    console.log( `server is running on port ${PORT}`);
   
})




