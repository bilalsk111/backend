let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs')
let { toFile } = require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources.js')
let jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPost(req, res) {
    console.log(req.body, req.file)

    let token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Token not provided, unauthorized"
        })
    }
    
    try{
        let decode = jwt.verify(token, process.env.JWT_TOKEN)
    }catch(err){
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    let file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: `post-${Date.now}`,
        folder: "insta-clone"
    });

    let newPost = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decode.id
    })


    res.status(201).json({
        message: "post upload successfully",
        newPost
    })
    res.send(file)

}




module.exports = {
    createPost
}