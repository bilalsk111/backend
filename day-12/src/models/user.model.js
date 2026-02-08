const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
         unique: [ true, "With this email user account already exists" ],
         required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model('users',UserSchema)

module.exports = userModel