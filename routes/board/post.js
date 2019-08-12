const express = require('express');
const con = require('../../connection');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const async = require('async');
const { check, validationResult } = require('express-validator');

//파일 업로드 설정
const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,path.resolve(process.cwd(), '/root/kt/routes/board/uploads')) // 최초 저장 경로 설정
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname); // 최초 이름 설정
	}
});
const upload = multer({ storage: storage});

// 게시판 조회
router.get("/",check('boardId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("list");
	var boardId = req.query.boardId;
	var sql = 'SELECT 게시글.*,사원.이름,게시글카테고리.카테고리명,게시판.게시판명,부서.부서명  from 게시글 JOIN 사원 ON 게시글.작성자=사원.사번  AND 게시글.소속게시판=? JOIN 게시글카테고리 ON 게시글.소속카테고리=게시글카테고리.카테고리번호 JOIN 게시판 ON 게시판.게시판번호=게시글.소속게시판 JOIN 부서 ON 부서.부서코드=사원.소속부서 ORDER BY 게시글.작성시각 DESC';
	con.query(sql,boardId,function(err,result,fields) {
		if(err) throw err;
		else {
			res.send({
				"status":"success",
				result:JSON.stringify(result)
			});
		}
	});
});
//최근 게시글 조회
router.get("/recent",function(req,res,next) {
	console.log("recent list");
	var sql = "SELECT 게시글.*,사원.이름,게시판.게시판명,부서.부서명 from 게시글 JOIN 사원 ON 게시글.작성자=사원.사번 JOIN 게시판 ON 게시판.게시판번호=게시글.소속게시판 JOIN 부서 ON 부서.부서코드=사원.소속부서 ORDER BY 게시글.작성시각 DESC LIMIT 5";
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
//핫게시글 조회
router.get("/hot",function(req,res,next) {
	console.log("recent list");
	var sql = "SELECT 게시글.*,사원.이름,게시판.게시판명,부서.부서명 from 게시글 JOIN 사원 ON 게시글.작성자=사원.사번 JOIN 게시판 ON 게시판.게시판번호=게시글.소속게시판 JOIN 부서 ON 부서.부서코드=사원.소속부서 ORDER BY 게시글.추천수 DESC LIMIT 5";
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
// 게시글 읽기
router.get("/view",check('postId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("read");
	var postId = req.query.postId;
	var sql = 'SELECt 게시글.*, 사원.이름 from 게시글 JOIN 사원 ON 게시글.작성자=사원.사번 AND 게시글.게시글번호=?';
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
//첨부파일 다운로드
router.get("/download",check('id').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("download file");
	var id = req.query.id;
	var sql = 'SELECT 첨부파일경로 from 게시글 where 게시글번호=?'
	con.query(sql,id,function(err,result,fields) {
		if(err) throw err;
		else res.download(result[0].첨부파일경로);
	});
});

//게시글 등록
router.post("/",[
	upload.single('userfile'),
	check('information').isJSON()
],function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("create post");
	var information = JSON.parse(req.body.information)
	var newDate = new Date();
	var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS'); // 현재 시각 받아옴
	var writer = information.writer,
	boardId = information.boardId,
	writetime = time,
	title = information.title,
	content = information.content,
	thumbsup = 0,
	categoryId = information.categoryId,
	tags = information.tags;
	console.log(tags[0]);
	if(!check('writer').isInt({min:10000000,max:99999999})||
	!check('information.boardId').isInt()||
	!check('information.content').isLength({min:1})||
	!check('information.title').isLength({min:1})||
	!check('information.categoryId').isInt()||
	!check('information.tags').isJSON())
		return res.status(422).json({ errors: errors.array() });
	var path, id;
	var i=0;
	var sql = 'INSERT INTO 게시글 (작성자, 소속게시판, 작성시각, 제목, 내용, 추천수, 소속카테고리) VALUES (?,?,?,?,?,?,?)';
	var params = [writer, boardId, writetime, title, content, thumbsup, categoryId];
	con.query(sql, params, function(err,result,fields) {
		if(err) throw err;
		var sql2 = 'insert into 해시태그 (태그명,태그횟수) VALUES (?,1) ON DUPLICATE KEY UPDATE 태그횟수=태그횟수+1, 태그번호=태그번호';
		console.log(tags[0]); // TODO : 쿼리문 반복 적용->완료
		async.forEach(tags,function(tag, callback) {
			con.query(sql2,tag,function(err,result,fields) {
				if(err) throw err;
				console.log(tag);
				var params3 = [tag, writer, title, writetime];
				var sql3 = 'select * from 해시태그 where 태그명=?;'+'select 게시글번호 from 게시글 where 작성자=? AND 제목=? AND 작성시각=?';
				con.query(sql3,params3,function(err,result,fields) {
					if(err) throw err;
					console.log(result[1][0].게시글번호);
					async.forEach(result[0],function(partResult,callback){
						var params2 = [result[1][0].게시글번호,partResult.태그번호];
						console.log(params2);
						con.query('insert ignore into 게시글태그 VALUES (?,?)',params2,function(err,result,fields) {
							if(err) throw err;
							console.log(result);
						});
					});
				});	
			});
		});
		if(req.file==null) res.send({"status":"success"}); // 파일 첨부 안했으면 그대로 종료
		else { // 파일 첨부했으면
			console.log("upload file");
			var filepath = req.file.path,
			originalname = req.file.originalname;
			var sql2 = 'SELECT 게시글번호 from 게시글 WHERE 작성자=? AND 제목=? AND 작성시각=?';
			var params2 = [writer, title, writetime];
			con.query(sql2,params2,function(err,result,fields) { // 생성된 게시글 번호 조회
				if(err) throw err;
				else {
					file_path='/root/kt/routes/board/uploads/'+result[0].게시글번호;
					console.log(filepath);
					console.log(file_path+"/"+originalname);
					console.log(originalname);
					fs.mkdir(file_path, (err) => { // 게시글번호 폴더 생성
						if(err) throw err;
						file_path='/root/kt/routes/board/uploads/'+result[0].게시글번호;
						fs.rename(filepath, file_path+"/"+originalname,(err)=>{ // 파일을 게시글번호 폴더 안으로 이동
							if(err) throw err;
							console.log(file_path);
							path = file_path+"/"+originalname;
							console.log(path);
							id = result[0].게시글번호;
							console.log(id);
							var params3 = [path,id];
							var sql3 = 'UPDATE 게시글 SET 첨부파일경로=? WHERE 게시글번호=?'; // 첨부파일경로 넣어줌
							con.query(sql3, params3, function(err,result,fields) {
								if(err) throw err;
								else res.send({"status":"success"});
							});
						});
					});
				}
			});
		}
	});	
});
//게시글 수정
//TODO : 게시글 수정 시 태그 수정 필요
router.put("/",[
	upload.single('userfile'),
	check('information').isJSON()
],function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("update post");
	var information = JSON.parse(req.body.information);
	var postId = information.postId,
	title = information.title,
	content = information.content,
	categoryId = information.categoryId;
	if(!check('postId').isInt()||
	!check('title').isLength({min:1})||
	!check('content').isLength({min:1})||
	!check('categoryId').isInt())
		return res.status(422).json({ errors: errors.array() });
	console.log(postId);
	if(req.file==null) { // 첨부파일 변경이 없을 경우
		var params = [title, content, categoryId, postId];
		var sql = 'UPDATE 게시글 SET 제목=?, 내용=?, 소속카테고리=? WHERE 게시글번호=?';
		con.query(sql, params, function(err,result,fields) {
			if(err) throw err;
			else res.send({"status":"success"});
		});
	}
	else { // 첨부파일 변경이 있음
		var sql2 = 'SELECT 첨부파일경로 from 게시글 where 게시글번호=?';
		var originalname = req.file.originalname;
		con.query(sql2,postId,function(err,result,fields) {
			var filepath = req.file.path;
			var file_path = '/root/kt/routes/board/uploads/'+postId;
			console.log(filepath);
			console.log(file_path);
			if(result[0].첨부파일경로!=null) { // 기존 파일 있으면 제거
				fs.unlink(result[0].첨부파일경로); // 파일 제거
				fs.rename(filepath,file_path+"/"+originalname,(err) => {
					if(err) throw err;
					console.log(filepath);
				});
			}
			else {
				fs.mkdir(file_path,(err)=>{
					if(err) throw err;
					fs.rename(filepath, file_path+"/"+originalname,(err) => {
						if(err) throw err;
						console.log(filepath);
					});
				});
			}
			var path = file_path+"/"+originalname;
			console.log(path);
			var pathparams = [path,postId];
			var sql3 = 'UPDATE 게시글 SET 첨부파일경로=? WHERE 게시글번호=?'; // 경로 수정
			con.query(sql3, pathparams, function(err,result,fields) {
				if(err) throw err;
				else res.send({"status":"success"});
			});
		});
	}
});
//게시글 삭제
router.delete("/",check('postId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("delete post");
	var postId = req.query.postId;
	var sql2 = 'SELECT 첨부파일경로 from 게시글 where 게시글번호=?';
	con.beginTransaction(function(err) {
		con.query(sql2,postId,function(err,result,fields) {
			if(result[0].첨부파일경로!=null) { // 파일있으면
				fs.unlink(result[0].첨부파일경로);//지워
				fs.rmdir('/root/kt/routes/board/uploads/'+postId);//경로도 지우고
			}
		});
		var sql4 = 'SELECT 태그번호 from 게시글태그 where 게시글번호=?';
		con.query(sql4,postId,function(err,result,fields) {
			if(err) throw err;
			var sql3 = 'UPDATE 해시태그 SET 태그횟수=태그횟수-1 where 태그번호=?'; // 게시글에 달려있던 해시태그의 태그횟수 1 감소
			async.forEach(result,function(partResult,callback) {
				con.query(sql3,partResult,function(err,result,fields) {
					if(err) throw err;
				});
			});
			var sql = 'DELETE from 게시글 where 게시글번호=?'; // TODO : DB 제약조건 CASCADE로 재설계 필요 -> 완료
			con.query(sql,postId,function(err,result,fields) {
				if(err) throw err;
				else { 
					con.commit();
					res.send({
						"status":"success"
					});
				}
			});
		});
		
	});
});
// 게시글 추천 여부 조회
router.get("/like",[check('postId').isInt(),check('id').isInt({min:10000000,max:99999999})],function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var postId = req.query.postId,
	id = req.query.id;
	var params = [postId, id];
	var sql = 'SELECT * from 게시글추천 where 추천게시글=? AND 추천사원=?';
	con.query(sql,params,function(err,result,fields) {
		if(err) throw err;
		else if(result[0]==null || result[0].체크!=1) res.send({"status":"unlike"});
		else if(result[0].체크==1) res.send({"status":"like"});
	});
});

// 게시글 추천
router.post("/like",[check('postId').isInt(),check('id').isInt({min:10000000,max:99999999})],function(req, res, next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("like post");
	var postId = req.body.postId,
	id = req.body.id;
	var params = [postId, id];
	var sql = 'SELECT * from 게시글추천 where 추천게시글=? AND 추천사원=?';
	con.query(sql,params,function(err,result,fields) {
		if(err) throw err;
		else if(result[0]==null) { // 처음 생성
			var sql2 = 'INSERT INTO 게시글추천 (추천게시글, 추천사원, 체크) VALUES (?,?,1)';
			con.query(sql2,params,function(err,result,fields) {
				if(err) throw err;
				else {
					var sql3 = 'UPDATE 게시글 SET 추천수=추천수+1 WHERE 게시글번호=?';
					con.query(sql3,postId,function(err,result,fields) {
						if(err) throw err;
						else res.send({"status":"like"});
					});
				}
			});
		}
		else if(result[0].체크==1) { // 좋아요 취소
			var sql2 = 'UPDATE 게시글추천 SET 체크=0 WHERE 추천게시글=? AND 추천사원=?';
			con.query(sql2,params,function(err,result,fields) {
				if(err) throw err;
				else {
					var sql3 = 'UPDATE 게시글 SET 추천수=추천수-1 WHERE 게시글번호=?';
					con.query(sql3,postId,function(err,result,fields) {
						if(err) throw err;
						else res.send({"status":"unlike"});
					});
				}
			});
		}
		else if(result[0].체크!=1) { // 좋아요 누르기
			var sql2 = 'UPDATE 게시글추천 SET 체크=1 WHERE 추천게시글=? AND 추천사원=?';
			con.query(sql2,params,function(err,result,fields) {
				if(err) throw err;
				else {
					var sql3 = 'UPDATE 게시글 SET 추천수=추천수+1 WHERE 게시글번호=?';
					con.query(sql3,postId,function(err,result,fields) {
						if(err) throw err;
						else res.send({"status":"like"});
					});
				}
			});
		}
	});
});

module.exports = router;
