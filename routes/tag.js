const express = require('express');
const con = require('../connection');
const router = express.Router();

//태그별 게시글 조회
router.get("/bytag",function(req,res,next) {
	var sql = "select 게시글.게시글번호,게시글.제목,해시태그.태그명,해시태그.태그번호 from 게시글 JOIN 해시태그 JOIN 게시글태그 ON 게시글태그.게시글번호=게시글.게시글번호 AND 게시글태그.태그번호 = 해시태그.태그번호 AND 해시태그.태그번호=?";
	var tagId = req.query.tagId;
	con.query(sql,postId,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});

});

//게시글별 태그 조회
router.get("/bypost",function(req,res,next) {
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
router.get("/bycode",function(req,res,next) {
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
