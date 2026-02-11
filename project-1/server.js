require('dotenv').config()
let app = require('./src/app')
let connectToDB = require('./src/config/database') 
let PORT = 3000;


connectToDB()


app.listen(PORT,()=>{
    console.log(`server running on Port ${PORT}`);
})