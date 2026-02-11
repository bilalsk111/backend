let mongoose = require('mongoose');

async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database connectes');  
    }catch(err){
        console.log('datbase not connect');
    }
}
 module.exports = connectToDB