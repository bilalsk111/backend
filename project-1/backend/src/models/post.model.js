const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    mediaUrl: {
        type: String,
        required: [true, "mediaUrl is required for creating an post"]
    },
     mediaType:{
        type: String,
        enum: ["image","video"],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required for creating an post"]
    }
}, { timestamps: true })


const postModel = mongoose.model("posts", postSchema)


module.exports = postModel

