let express = require('express')
let postRouter = express.Router();
let authmiddleware = require('../middlewares/auth.middleware')
let multer = require('multer');
let {createPost,GetFeed,detailsPosts} =require('../controllers/post.controller');
let storage = multer.memoryStorage();
let upload  = multer({storage,limits:{fileSize: 50*1024*1024}})

postRouter.post('/',authmiddleware,upload.single('media'),createPost);
postRouter.get('/',authmiddleware,GetFeed)
postRouter.get('/details/:id',authmiddleware,detailsPosts)

module.exports = postRouter