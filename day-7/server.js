const { config } = require('dotenv');
const app = require('./src/app');
const connectToDB = require('./src/config/database');
const PORT = 3000;


require('dotenv').config();

connectToDB();


app.listen(PORT,()=>{
    console.log(`server running in port ${
        PORT
    }`);
    
})