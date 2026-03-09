let mongoose  =  require('mongoose')

let postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:"Enter a caption"
    },
    mediaUrl:{
        type:String,
        required:true
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        required:true

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
},{timestamps:true})

let postModel =  mongoose.model('post',postSchema)

module.exports = postModel