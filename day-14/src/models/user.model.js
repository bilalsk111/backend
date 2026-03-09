let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        uniquse: [true,"Email already exist"]
    },
    password: String
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;