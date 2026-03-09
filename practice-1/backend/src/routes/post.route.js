let express = require('express')
let postRouter = express.Router()
let multer = require('multer')
let storage = multer.memoryStorage()
let upload = multer({storage,limits:{fileSize: 50*1024*1024}})
let authmiddleware = require('../middlewares/auth.middleware')
let {createPost,GetPost,toggleLikes,getPostLikes} = require('../controllers/post.controller')






postRouter.post('/',authmiddleware,upload.single('media'),createPost);
postRouter.get('/',authmiddleware,GetPost);
postRouter.post('/like/:postId',authmiddleware,toggleLikes)
postRouter.get('/likes/:postId', getPostLikes);






module.exports = postRouter