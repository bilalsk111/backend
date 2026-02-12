const express = require('express');
const {  createPost } = require('../controllers/post.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const postRouter = express.Router();

postRouter.post('/', upload.single('image'),  createPost);

module.exports = postRouter;

