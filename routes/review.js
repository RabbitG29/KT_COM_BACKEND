const express = require('express');
const con = require('../connection');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');
const async = require('async');
const { check, validationResult } = require('express-validator');

const commentRouter = require('./comment');

//파일 업로드 설정
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.resolve(process.cwd(), '/root/kt/routes/uploads'))
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

router.get("/",[
	check('id').isInt({min:10000000,max:99999999}),
	check('deptId').isInt()
],function(req, res, next){
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("read");
	var id = req.query.id,
	mode = req.query.mode,
	deptId = req.query.deptId;
	console.log(mode); // 1: 나만보기, 2: 부서공개, 3: 전체공개
	if(mode==1) { // My Code
		var sql = "SELECT 코드.*, 사원.이름,부서.부서명 from 코드 JOIN 사원 ON 사원.사번=코드.작성자 AND 코드.작성자=? JOIN 부서 ON 사원.소속부서=부서.부서코드 AND 코드.공개범위>=1  ORDER BY 코드.작성시간 DESC";	
	}
	else if(mode==2) { // 부서 Code
		var sql = "SELECT 코드.*, 사원.이름, 부서.부서명 from 코드 JOIN 사원 ON 사원.사번=코드.작성자 JOIN 부서 ON 부서.부서코드=사원.소속부서 AND 사원.소속부서=? AND 코드.공개범위>=2 ORDER BY 코드.작성시간 DESC";
		con.query(sql,deptId,function(err,result,fields) {
			if(err) throw err;
			else {
				res.send({
					"status":"success",
					result:JSON.stringify(result)
				});
			}
		});
	}
	else { // 전체 공개
		var sql = "SELECT 코드.*, 사원.이름,부서.부서명 from 코드 JOIN 사원 ON 코드.작성자=사원.사번 JOIN 부서 ON 사원.소속부서=부서.부서코드 AND 코드.공개범위>=3 ORDER BY 코드.작성시간 DESC";
	}
	if(mode!=2) {
		con.query(sql,id,function(err, result, fields) {
			if(err) throw err;
			else {
				res.send({
					"status":"success",
					result:JSON.stringify(result)
				});
			}
		});
	}
});
// 최근 코드리뷰 조회
router.get("/recent",function(req,res,next) {
	console.log("recent");
	var sql = "SELECT 코드.*, 사원.이름, 부서.부서명 from 코드 JOIN 사원 ON 사원.사번=코드.작성자 JOIN 부서 ON 사원.소속부서=부서.부서코드 AND 코드.공개범위>=3 ORDER BY 코드.작성시간 DESC LIMIT 5";
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
//댓글이 많은 코드리뷰 조회
router.get("/many",function(req,res,next) {
	var sql = "SELECT 사원.이름, 코드.코드번호, 코드.파일명,코드댓글수.댓글수 from 코드 JOIN (select 코드댓글.소속코드, count(코드댓글.소속코드) as 댓글수 from 코드댓글 group by 소속코드) as 코드댓글수 ON 코드댓글수.소속코드=코드.코드번호 AND 코드.공개범위>=3 JOIN 사원 ON 사원.사번=코드.작성자 ORDER BY 댓글수 DESC LIMIT 5";
	con.query(sql,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});
});
router.get("/download",check('id').isInt(),function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("download code");
	var id = req.query.id;
	console.log(id);
	var sql = 'select 파일경로 from 코드 where 코드번호=?';
	con.query(sql,id,function(err,result,fields) {
		if(err) throw err;
		else {
			res.download(result[0].파일경로);
		}
	});
});

router.post("/", [
	upload.single('userfile'),
	check('writer').isInt({min:10000000,max:99999999}),
	check('mode').isInt({min:1,max:3}),
	check('organization').isLength({min:1}),
	(check('tags').isJSON()||check('tags').isEmpty())
],function(req, res, next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("upload code for review");
	console.log(req.body);
	var newDate = new Date(); // 현재시간 받아 옴
	var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
	var time2 = newDate.toFormat('YYMMDDHH24MISS'); // 경로 생성을 위한 format
	var writer = req.body.id,
	writetime = time,
	mode = req.body.mode,
	organization = req.body.organization,
	tags = JSON.parse(req.body.tags);
	if(organization=='') organization='kt';
	if(req.file==null)
		res.send({"status":"none"});
	else {
		var filepath = req.file.path,
		originalname = req.file.originalname; // rename을 위한 original name 저장(확장자까지 저장됨)
		console.log("origin : "+filepath);
		console.log(originalname);
		var file_path = '/root/kt/routes/uploads/'+writer+'/'+time2;
		console.log(file_path);
		fs.stat('/root/kt/routes/uploads/'+writer,(err) => { // writer 경로가 이미 존재하는지 확인
			if(!err) { // 이미 존재
				fs.mkdir(file_path, {recursive:true}, (err) => {
					if(err) throw err;
					else console.log("make dir");
					fs.rename(filepath, file_path+"/"+originalname,(err) =>{
						if(err) throw err;
					});
					console.log(file_path);
				});
			}
			else { // 존재하지 않을 경우 새로 생성
				fs.mkdir('/root/kt/routes/uploads/'+writer,{recursive:true},(err) => {
					if(err) throw err;
					fs.mkdir(file_path, {recursive:true}, (err) => {
						if(err) throw err;
						else console.log("make dir");
						fs.rename(filepath, file_path+"/"+originalname,(err) =>{
							if(err) throw err;
						});
						console.log(file_path);
					});
				});
			}
		});
		console.log("씨발");
		var path2 = file_path+"/"+originalname;
		console.log(path2);
		var link = "https://sonarcloud.io/dashboard?id="+writer+"-"+originalname;
		var params = [writer, writetime, path2, originalname, link, mode];
		console.log(params);
		var sql = 'INSERT INTO 코드 (작성자, 작성시간, 파일경로,파일명,링크,공개범위) VALUES (?,?,?,?,?,?)';
		con.query(sql, params, function(err, result, fields) {
			if(err) console.log(err);
//			else res.send({"status":"success"});
			else {
				var sql2 = 'insert into 해시태그 (태그명,태그횟수) VALUES (?,1) ON DUPLICATE KEY UPDATE 태그횟수=태그횟수+1, 태그번호=태그번호';
				async.forEach(tags,function(tag, callback) {
					con.query(sql2,tag,function(err,result,fields) {
						if(err) throw err;
						var params2 = [tag, writer, originalname, writetime];
						console.log(params2);
						var sql3 = 'select * from 해시태그 where 태그명=?;'+'select 코드번호 from 코드 where 작성자=? AND 파일명=? AND 작성시간=?';
						con.query(sql3,params2,function(err,result,fields) {
							if(err) throw err;
							async.forEach(result[0],function(partResult, callback) {
								var params3 = [result[1][0].코드번호,partResult.태그번호];
								console.log(params3);
								con.query('insert ignore into 코드태그 VALUES (?,?)',params3,function(err,result,fields) {
									if(err) throw err;
									//Sonar-Scanner
									//TODO : project를 마음대로 생성할 수 있는지? -> 완료
									//TODO : zip과 code 형식을 분기하여 처리하면 좋을 듯->완료
									// organization은 마음대로 관리할 수 없음, organization을 따로 할당해야 할 듯 or 입력을 받는 식으로?									
								});
							});
						});
					});
				});
				console.log(result);
				shell.cd(file_path); // 해당 디렉토리로 이동해서
				console.log(path.extname(originalname));
				if(path.extname(originalname)==".zip") // 확장자가 zip이면
					shell.exec("unzip "+originalname); // 압축해제를 먼저 해준다
					console.log("???");
					shell.exec("sonar-scanner -Dsonar.projectKey="+writer+"-"+originalname+" -Dsonar.organization="+organization+" -Dsonar.host.url=https://sonarcloud.io -Dsonar.login=982cf3839f11d609e7e510c32eb4459e93bb743b"); // sonar-scanner 동작
				res.send({
					"status":"success",
					"link":"https://sonarcloud.io/dashboard?id="+writer+"-"+originalname // TODO : dashboard 링크를 주자->완료
				});
			}
		});
	}
});

router.delete("/", check('id').isInt({min:1}), function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var id = req.query.id;
	var sql = "DELETE FROM 코드 where 코드번호=?";
	var sql2 = "SELECT 파일경로 from 코드 where 코드번호=?";
	var sql3 = "SELECT 태그번호 from 코드태그 where 코드번호=?";
	con.query(sql2,id,function(err, result, fields) {
		if(result[0].파일경로!=null) {
			fs.unlink(result[0].파일경로);
//			fs.rmdir // -> TODO : 경로 지워야함
		}
	});
	con.query(sql3,id,function(err,result,fields) {
		if(err) throw err;
		var sql4 = "UPDATE 해시태그 SET 태그횟수=태그횟수-1 where 태그번호=?";
		async.forEach(result,function(partResult,callback) {
			con.query(sql3,partResult,function(err,result,fields) {
				if(err) throw err;
			});
		});
		con.query(sql,id,function(err, result, fields) {
			if(err) throw err;
			else {
				res.send({"status":"success"});
			}
		});
	});
});
router.use('/comment',commentRouter);
module.exports = router;
