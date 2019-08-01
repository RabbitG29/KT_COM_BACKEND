const express = require('express');
const con = require('../../connection');
const router = express.Router();

// 댓글 조회
router.get("/",function(req,res,next) {
	console.log("read comment");
	var postId = req.query.postId;
	var sql = 'SELECT 게시글댓글.*,사원.이름 from 게시글댓글 JOIN 사원 ON 게시글댓글.작성자=사원.사번 AND 게시글댓글.소속게시글=?';
	con.query(sql,postId,function(err,result,fields) {
		if(err) throw err;
		else {
			res.send({
				"status":"success",
				result:JSON.stringify(result)
			});
		}
	});
});

router.post("/",function(req,res,next) {
	console.log("create comment");
	var newDate = new Date();
	var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
	var writer = req.body.writer,
	postId = req.body.postId,
	writetime = time,
	content = req.body.content;
	var sql = 'INSERT INTO 게시글댓글 (작성자,소속게시글,작성시각,내용) VALUES (?,?,?,?)';
	var params = [writer, postId, writetime, content];
	con.query(sql,params,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});
// 댓글 수정
router.put("/",function(req,res,next) {
	console.log("update comment");
	var commentId = req.body.commentId,
	content = req.body.content;
	var params = [content,commentId];
	var sql = 'UPDATE 게시글댓글 SET 내용=? WHERE 댓글번호=?';
	con.query(sql,params,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});
// 댓글 삭제
router.delete("/",function(req,res,next) {
	console.log("delete comment");
	var commentId = req.query.commentId;
	console.log(commentId);
	var sql = 'delete from 게시글댓글 where 댓글번호=?';
	con.query(sql,commentId,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});

module.exports = router;
