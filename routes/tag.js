const express = require('express');
const con = require('../connection');
const router = express.Router();
const async = require('async');
const { check, validationResult } = require('express-validator');

//태그별 게시글 조회
router.post("/bytag",check('mode').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty() || !check('tags').isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	//var sql = "select 게시글.게시글번호,게시글.제목,해시태그.태그명,해시태그.태그번호 from 게시글 JOIN 해시태그 JOIN 게시글태그 ON 게시글태그.게시글번호=게시글.게시글번호 AND 게시글태그.태그번호 = 해시태그.태그번호 AND 해시태그.태그번호=?";
	if(req.body.mode==0)
		var sql = "select 게시글.*,게시글카테고리.카테고리명,사원.이름 from 게시글 JOIN 해시태그 JOIN 게시글태그 ON 게시글태그.게시글번호=게시글.게시글번호 AND 게시글태그.태그번호 = 해시태그.태그번호 AND 해시태그.태그번호=? JOIN 게시글카테고리 ON 게시글.소속카테고리=게시글카테고리.카테고리번호 JOIN 사원 ON 사원.사번=게시글.작성자 ORDER BY 게시글.작성시각 DESC";
	else
		var sql = "select 코드.*,사원.이름,부서.부서명 from 코드 JOIN 해시태그 JOIN 코드태그 ON 코드태그.코드번호=코드.코드번호 AND 코드태그.태그번호 = 해시태그.태그번호 AND 해시태그.태그번호=? JOIN 사원 ON 사원.사번=코드.작성자 AND 코드.공개범위>=3 JOIN 부서 ON 부서.부서코드=사원.소속부서 ORDER BY 코드.작성시간 DESC";
	var sql2 = "select * from 해시태그 where 태그명=?";
	var tags = [];
	var results = [];
	var asyncCount = 0;
	console.log(req.body.tags);
	tags = req.body.tags;
	console.log(tags);
	async.forEach(tags,function(tag,callback) {
		con.query(sql2,tag,function(err,result,fields) {
			if(err) throw err;
			console.log(result[0]);
			console.log(result[0].태그번호);
			con.query(sql,result[0].태그번호,function(err,result2,fields) {
				if(err) throw err;
				console.log("hi");
				/*for(var i=0;i<result.length;i++) {
					results.push(result2[i]);
					console.log(result2[i]);
				}*/
				if(result2.length!=0)
					results.push(result2);
				console.log("results");
				console.log(results);
				asyncCount++;
				if(asyncCount>=tags.length) { // TODO : 중복제거 + 중복 필터링(AND/OR로 할 수 있을 듯?)
					res.send({
						"status":"success",
						result:JSON.stringify(results)
					});
				}
			});
		});
	});
});

//게시글별 태그 조회
router.get("/bypost",check('postId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var sql = "select 게시글.게시글번호,게시글.제목,해시태그.태그명,해시태그.태그번호 from 게시글 JOIN 해시태그 JOIN 게시글태그 ON 게시글태그.게시글번호=게시글.게시글번호 AND 게시글태그.태그번호 = 해시태그.태그번호 AND 게시글.게시글번호=?";
	var postId = req.query.postId;
	con.query(sql,postId,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});
});

//코드별 태그 조회
router.get("/bycode",check('codeId').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var sql = "select 코드.코드번호,코드.파일명,해시태그.태그명,해시태그.태그번호 from 코드 JOIN 해시태그 JOIN 코드태그 ON 코드태그.코드번호=코드.코드번호 AND 코드태그.태그번호 = 해시태그.태그번호 AND 코드.코드번호=?";
	var codeId = req.query.codeId;
	console.log(codeId);
	con.query(sql,codeId,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});
});

//인기 태그 조회
router.get("/liketag",function(req,res,next) {
	var sql = "SELECT * from 해시태그 ORDER BY 태그횟수 DESC LIMIT 5";
	con.query(sql,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});
});

module.exports = router;
