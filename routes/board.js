const express = require('express');
const con = require('../connection');
const router = express.Router();
const postRouter = require('./board/post');
const commentRouter = require('./board/comment');
router.use('/post', postRouter);
router.use('/comment', commentRouter);

//카테고리 조회
router.get("/categories",function(req,res,next) {
	console.log("category list");
	var sql = "SELECT * from 게시글카테고리";
	con.query(sql,function(err,result,fields) {
		if(err) throw err;
		else {
			res.send({
				"status":"success",
				result:JSON.stringify(result)
			});
		}
	});
});

module.exports = router;
