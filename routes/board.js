const express = require('express');
const con = require('../connection');
const router = express.Router();
const postRouter = require('./board/post');
const commentRouter = require('./board/comment');
router.use('/post', postRouter);
router.use('/comment', commentRouter);

module.exports = router;
