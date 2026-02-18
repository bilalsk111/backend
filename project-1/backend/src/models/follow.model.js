let mongoose = require('mongoose')

let followSchema = new mongoose.Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'follower is required'],
    },
    followee:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'following is required'],
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending',
    }
},{timestamps: true})

followSchema.index(
    { follower: 1, followee: 1 },
    { unique: true }
);

let followModel = mongoose.model('follow',followSchema)

module.exports = followModel