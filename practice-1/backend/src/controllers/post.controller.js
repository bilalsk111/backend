let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs/index.js')
let { toFile } = require('@imagekit/nodejs/index.js');
const likeModel = require('../models/like.model');

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function createPost(req,res){
    let userId = req.user.id

    if(!req.file){
        return res.status(401).json({
            message:"media required"
        })
    }
    let isVideo = req.file.mimetype.startsWith("video")
    let isimage = req.file.mimetype.startsWith("image")
    if(!isVideo && !isimage){
        return res.status(401).json({
            message: "only image/video allowed"
        })
    }
    let uploadfile = await imagekit.files.upload({
        file: await toFile(req.file.buffer,req.file.originalname),
        fileName: `post-${Date.now()}`,
        folder: "practice"
    })

    let newPost = await postModel.create({
        caption:req.body.caption,
        mediaUrl:uploadfile.url,
        mediaType:isVideo ? "video" : "image",
        user:userId
    })
 res.status(201).json({
        message:"post uploaded successfully",
        newPost
    })
}

async function GetPost(req,res){
    let userId = req.user.id 

    let post =  await postModel
                        .find({user:userId})
                        .sort({creatAt:-1})
     res.status(201).json({
        post
    })
}

async function toggleLikes(req,res){
    let userId = req.user.id
    let postId = req.params.postId
    if(!postId){
        return res.status(401).json({
            message:"post not found"
        })
    }

    let post = await postModel.findById(postId)

    let existingLike = await likeModel.findOne({
        post:postId,
        user:userId
    })
    if(existingLike){
        await likeModel.findOneAndDelete({id:existingLike._id})
           return res.json({
            message: "Post unliked"
        });
    }
      await likeModel.create({
        post: postId,
        user: userId
    });

    res.json({
        message: "Post liked"
    });
}
async function getPostLikes(req,res) {
    let postId = req.user.postId
    let likes = await likeModel
                    .find({post:postId})
                    .populate("user","username")
    res.json({
         totalLikes: likes.length,
        likes
    })
}
module.exports = {
    createPost,GetPost,toggleLikes,getPostLikes
}