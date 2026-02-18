let mongoose = require('mongoose')

let followSchema = new mongoose.Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true,'follower is required ']
    },
    followee:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true,'followee is required ']
    },
    status:{
        type:String,
        enum: ['pending','accpted','rejected'],
        default:'pending'
    }
},{timestamps:true})

followSchema.index({follower:1,followee:1},{unique:true})

let follow = mongoose.model('follow',followSchema)

module.exports = follow