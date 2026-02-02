const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique: true,
        match: [/^\d{10}$/, 'Please fill a valid 10 digit phone number']
    },
    email: {type: String, required: true, unique: true}
})

const User = mongoose.model('User', usersSchema);

module.exports = User;