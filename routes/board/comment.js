const express = require('express');
const con = require('../../connection');
const router = express.Router();
const { check, validationResult } = require('express-validator');
/**
* @swagger
* /board/comment:
*   get:
*     summary: 게시글별 댓글 조회
*     tags:
*       - post comment
*     description: 게시글별 댓글 조회
*     produces:
*       - application/json
*     parameters:
*       - name: postId
*         in: query
*         type: integer
*         description: 게시글 번호
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 조회
router.get("/",check('postId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("read comment");
	var postId = req.query.postId;
	var sql = 'SELECT 게시글댓글.*,사원.이름 from 게시글댓글 JOIN 사원 ON 게시글댓글.작성자=사원.사번 AND 게시글댓글.소속게시글=? ORDEr BY 게시글댓글.작성시각 DESC';
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
/**
* @swagger
* /board/comment:
*   post:
*     summary: 게시글에 댓글 작성
*     tags:
*       - post comment
*     description: 게시글에 댓글 작성
*     produces:
*       - application/json
*     parameters:
*       - name: writer
*         in: body
*         type: integer
*         example: { writer: 10151257 }
*         description: 댓글 작성자(사번)
*       - name: postId
*         in: body
*         type: integer
*         example: { postId: 1 }
*         description: 게시글 번호
*       - name: content
*         in: body
*         type: string
*         example: { content: 게시글이 좋습니다. }
*         description: 댓글 내용
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
// 댓글 작성
router.post("/",[
	check('writer').isInt({min:10000000,max:99999999}),
	check('postId').isInt(),
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
/**
* @swagger
* /board/comment:
*   put:
*     summary: 게시글 댓글 수정
*     tags:
*       - post comment
*     description: 게시글에 있던 댓글 수정
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
	var sql = 'UPDATE 게시글댓글 SET 내용=? WHERE 댓글번호=?';
	con.query(sql,params,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});
/**
* @swagger
* /board/comment:
*   delete:
*     summary: 게시글 댓글 삭제
*     tags:
*       - post comment
*     description: 게시글에 있던 댓글 삭제
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
	var sql = 'delete from 게시글댓글 where 댓글번호=?';
	con.query(sql,commentId,function(err,result,fields) {
		if(err) throw err;
		else res.send({"status":"success"});
	});
});

module.exports = router;
