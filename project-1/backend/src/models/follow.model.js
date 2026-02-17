const { default: mongoose } = require('mongoose')
let mogoonse = require('mongoose')

let followSchema = new mongoose.Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'follower is required']
    },
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'following is required']
    }
},{timestamps: true})

let followModel = mogoonse.model('follow',followSchema)

module.exports = followModel