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
async function GetFeed(req, res) {
    try {
        let userId = req.user.id;

        let posts = await postModel
            .find()
            .populate("user", "username profileImage")
            .sort({ createdAt: -1 });

        const postsWithLikes = await Promise.all(
            posts.map(async (post) => {
                const totalLikes = await likeModel.countDocuments({ post: post._id });

                const isLiked = await likeModel.exists({
                    post: post._id,
                    user: userId
                });

                return {
                    ...post.toObject(),
                    totalLikes,
                    isLiked: !!isLiked
                };
            })
        );

        res.json({ post: postsWithLikes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
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
    const { postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = await likeModel.findOne({ post: postId, user: userId });

    let liked;

    if (existing) {
        await existing.deleteOne();
        liked = false;
    } else {
        await likeModel.create({ post: postId, user: userId });
        liked = true;
    }

    const totalLikes = await likeModel.countDocuments({ post: postId });

    res.json({ liked, totalLikes });
}
async function getPostLikes(req, res) {
    const { postId } = req.params;

    const likes = await likeModel
        .find({ post: postId })
        .populate("user", "username profileImage");

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
