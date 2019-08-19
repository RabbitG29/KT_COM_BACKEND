const express = require('express');
const con = require('../connection');
const router = express.Router();
const { check, validationResult } = require('express-validator');
/**
* @swagger
* /review/comment:
*   get:
*     summary: 코드별 댓글 조회
*     tags:
*       - review comment
*     description: 코드별 댓글 조회
*     produces:
*       - application/json
*     parameters:
*       - name: codeId
*         in: query
*         type: integer
*         description: 코드 번호
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 조회
router.get("/",check('codeId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("read comment");
	console.log(req.query.codeId);
	var codeId = req.query.codeId;
	var sql = 'SELECT 코드댓글.*,사원.이름 from 코드댓글 JOIN 사원 ON 코드댓글.작성자=사원.사번 AND 코드댓글.소속코드=? ORDER BY 코드댓글.작성시각 DESC';
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
/**
* @swagger
* /review/comment:
*   post:
*     summary: 코드에 댓글 작성
*     tags:
*       - review comment
*     description: 코드에 댓글 작성
*     produces:
*       - application/json
*     parameters:
*       - name: writer
*         in: body
*         type: integer
*         example: { writer: 10151257 }
*         description: 댓글 작성자(사번)
*       - name: codeId
*         in: body
*         type: integer
*         example: { codeId: 1 }
*         description: 코드 번호
*       - name: content
*         in: body
*         type: string
*         example: { content: 코드 리뷰가 좋습니다. }
*         description: 댓글 내용
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 작성
router.post("/",[
	check('writer').isInt(),
	check('codeId').isInt(),
	check('content').isLength({min:1})
],function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
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
/**
* @swagger
* /review/comment:
*   put:
*     summary: 코드 댓글 수정
*     tags:
*       - review comment
*     description: 코드에 있던 댓글 수정
*     produces:
*       - application/json
*     parameters:
*       - name: commentId
*         in: body
*         type: integer
*         example: {commentId: 1 }
*         description: 댓글 번호
*       - name: content
*         in: body
*         type: string
*         example: {content: "수정이 있었습니다."}
*         description: 댓글 내용
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 수정
router.put("/",[check('commentId').isInt(),check('content').isLength({min:1})],function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
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
/**
* @swagger
* /review/comment:
*   delete:
*     summary: 코드 댓글 삭제
*     tags:
*       - review comment
*     description: 코드에 있던 댓글 삭제
*     produces:
*       - application/json
*     parameters:
*       - name: commentId
*         in: query
*         type: integer
*         example: {commentId: 1 }
*         description: 댓글 번호
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 삭제
router.delete("/",check('commentId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
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
