const mongoose = require('mongoose');

const userSChema = new mongoose.Schema({
    name: String,
    email: {
        type:String,
        unique: [true,"email already here pls enter a new email"],
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model('users',userSChema);


module.exports = userModel