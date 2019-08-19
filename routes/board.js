const express = require('express');
const con = require('../connection');
const router = express.Router();
const postRouter = require('./board/post');
const commentRouter = require('./board/comment');
router.use('/post', postRouter);
router.use('/comment', commentRouter);
/**
* @swagger
* /board/categories:
*   get:
*     summary: 총 카테고리 조회
*     tags:
*       - category
*     description: 총 카테고리 조회
*     produces:
*       - application/json
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
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
