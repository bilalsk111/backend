let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs/index.js')
let { toFile } = require('@imagekit/nodejs/index.js')
const likeModel = require('../models/like.model')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

// CREATE POST
async function createPost(req,res){
    let userId = req.user.id

    if(!req.file){
        return res.status(401).json({
            message:"media required"
        })
    }

    let isVideo = req.file.mimetype.startsWith('video')
    let isimage = req.file.mimetype.startsWith('image')
    if(!isVideo && !isimage){
        return res.status(404).json({
            message:"only image/video allowed"
        })
    }
    let uploadfile = await imagekit.files.upload({
        file: await toFile(req.file.buffer,req.file.originalname),
        fileName: `post-${Date.now()}`,
        folder: 'insta-clone'
    })
    let newPost = await postModel.create({
        caption:req.body.caption,
        mediaUrl:uploadfile.url,
        mediaType: isVideo ? "video" : "image",
        user:userId
    })
    res.status(201).json({
        message:"post uploaded successfully",
        newPost
    })
 }


// GET FEED (own posts only)
async function GetFeed(req,res){
    let userId = req.user.id
    let post = await postModel
                    .find({user:userId})
                    .sort({creatAt: -1})
        res.status(201).json({
        post
    })
}


// GET SINGLE POST (public)
async function detailsPosts(req,res){
    let postId = req.params.id
    let post = await postModel
                    .findById(postId)
                    .populate('user','username email')
    if(!post){
        return res.status(401).json({
            message:"post not found"
        })
    }
        res.status(200).json({ post })
}

/**
 * Toggle Like
 * Route: POST /api/posts/like/:id
 */
async function toggleLike(req, res) {

    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await likeModel.findOne({
        post: postId,
        user: userId
    });

    if (existingLike) {
        await likeModel.deleteOne({ _id: existingLike._id });

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
async function getPostLikes(req, res) {

    const postId = req.params.postId;

    const likes = await likeModel
        .find({ post: postId })
        .populate('user', 'username');

    res.json({
        totalLikes: likes.length,
        likes
    });
}

module.exports = {
    createPost,
    GetFeed,
    detailsPosts,
    toggleLike,
    getPostLikes
}
