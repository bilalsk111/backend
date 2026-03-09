let express = require('express')
let postRouter = express.Router();
let authmiddleware = require('../middlewares/auth.middleware')
let multer = require('multer');
let { createPost, GetFeed, detailsPosts, toggleLike, getPostLikes, deletePost, toggleSavePost, getSavedPosts,createComment,getComments

 } = require('../controllers/post.controller');
let storage = multer.memoryStorage();
let upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } })

postRouter.post('/create', authmiddleware, upload.single('media'), createPost);
postRouter.get('/feed', authmiddleware, GetFeed)
postRouter.get('/details/:id', authmiddleware, detailsPosts)
postRouter.post('/like/:postId', authmiddleware, toggleLike)
postRouter.get('/likes/:postId', getPostLikes);
postRouter.get("/saves", authmiddleware, getSavedPosts);
postRouter.post("/:id/save", authmiddleware, toggleSavePost);
postRouter.delete("/:id", authmiddleware, deletePost);
postRouter.post("/:postId/comment", authmiddleware, createComment);
postRouter.get("/:postId/comments", authmiddleware, getComments);
module.exports = postRouter
