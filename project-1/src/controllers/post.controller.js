let postModel = require('../models/post.model')
let ImageKit = require('@imagekit/nodejs')
let { toFile } = require('@imagekit/nodejs')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function CreatepostController(req, res) {
    console.log(req.body, req.file)
    let file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: 'Test',
    });

    res.send(file)

}




module.exports = {
    CreatepostController
}