let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs')
let { toFile } = require('@imagekit/nodejs')
let jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPost(req, res) {

    // read token from cookies
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided, unauthorized"
        })
    }

    let decode
    try {
        decode = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (err) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    if (!req.file) {
        return res.status(400).json({
            message: "media required"
        })
    }

    const isVideo = req.file.mimetype.startsWith("video")
    const isImage = req.file.mimetype.startsWith("image")

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
        user: decode.id
    })

    res.status(201).json({
        message: "post upload successfully",
        newPost
    })
}



async function GetFeed(req, res) {

    try {
        let posts = await postModel
            .find()
            .populate('user', "username email")
            .sort({ createdAt: -1 })
        res.json(posts)
    } catch (err) {
         console.log(err)
        res.status(500).json({
            
            message: "server error"
        })
    }
}

async function toggelLike(req, res) {
    let token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "unthorized"
        })
    }

    let decode
    try {
        decode = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (err) {
        return res.status(401).json({ message: "user not authorized" })
    }

    let post = await postModel.findById(req.params.id)

    let alreadyliked = post.likes.includes(decode.id)

    if (alreadyliked) {
        post.likes.pull(decode.id)
    } else {
        post.likes.push(decode.id)
    }

    await post.save()

    res.status(201).json({
        message: alreadyliked ? "unliked" : "liked",
        postId: post._id,
        likesCount: post.likes.length
    })

    console.log("User:", decode.id)
console.log("Post:", post._id)
console.log("Likes:", post.likes)


}


module.exports = {
    createPost, GetFeed,toggelLike
}