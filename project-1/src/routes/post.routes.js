const express = require('express');
const {  createPost,GetFeed,toggelLike } = require('../controllers/post.controller');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const postRouter = express.Router();

postRouter.post('/', upload.single('media'), createPost);
postRouter.get('/',GetFeed)
postRouter.post('/like/:id',toggelLike)


module.exports = postRouter;

