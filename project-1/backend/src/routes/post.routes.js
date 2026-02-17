let express = require('express')
let postRouter = express.Router();
let authmiddleware = require('../middlewares/auth.middleware')
let multer = require('multer');
let {createPost,GetFeed,toggleLike,detailsPosts} =require('../controllers/post.controller');
let storage = multer.memoryStorage();
let upload  = multer({storage,limits:{fileSize: 50*1024*1024}})

postRouter.post('/',authmiddleware,upload.single('media'),createPost);

postRouter.get('/',authmiddleware,GetFeed)
postRouter.post('/likes/:id',authmiddleware,toggleLike)
postRouter.get('/details/:id',authmiddleware,detailsPosts)

module.exports = postRouter