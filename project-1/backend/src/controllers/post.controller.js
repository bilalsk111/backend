let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs/index.js')
let { toFile } = require('@imagekit/nodejs/index.js')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})



// CREATE POST
async function createPost(req, res) {
    let userId = req.user.id
    if (!req.file) {
        return res.status(401).json({
            message: "media required"
        })
    }
    let isVideo = req.file.mimetype.startsWith('video')
    let isImage = req.file.mimetype.startsWith('image')

    if (!isVideo && !isImage) {
        return res.status(400).json({
            message: "only image/video allowed"
        })
    }
    let uploadedFile = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: `post-${Date.now()}`,
        folder: "insta-clone"
    })
    let newPost = await postModel.create({
        caption: req.body.caption,
        mediaUrl: uploadedFile.url,
        mediaType: isVideo ? "video" : "image",
        user: req.user.id
    })
    res.status(201).json({
        message: "post upload successfully",
        newPost
    })
}


// GET FEED (own posts only)
async function GetFeed(req, res) {
    let userId = req.user.id
    let post = await postModel
        .find({ user: userId })
        .sort({ craetAt: -1 })
    res.status(201).json({
        post
    })
}


// GET SINGLE POST (public)
async function detailsPosts(req, res) {
    let postId = req.params.id
    let post = await postModel
        .findById(postId)
        .populate('user', "username email")
    if (!post) {
        return res.status(401).json({
            message: "post not found"
        })
    }
    res.status(200).json({ post })
}

module.exports = {
    createPost,
    GetFeed,
    detailsPosts
}
