const express = require('express');
const con = require('../connection');
const router = express.Router();

// 댓글 조회
router.get("/",function(req,res,next) {
	console.log("read comment");
	console.log(req.query.codeId);
	var codeId = req.query.codeId;
	var sql = 'SELECT 코드댓글.*,사원.이름 from 코드댓글 JOIN 사원 ON 코드댓글.작성자=사원.사번 AND 코드댓글.소속코드=?';
	con.query(sql,codeId,function(err,result,fields) {
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
	codeId = req.body.codeId,
	writetime = time,
	content = req.body.content;
	var sql = 'INSERT INTO 코드댓글 (작성자,소속코드,작성시각,내용) VALUES (?,?,?,?)';
	var params = [writer, codeId, writetime, content];
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
	var sql = 'UPDATE 코드댓글 SET 내용=? WHERE 댓글번호=?';
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
	var sql = 'delete from 코드댓글 where 댓글번호=?';
	con.query(sql,commentId,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});

module.exports = router;
