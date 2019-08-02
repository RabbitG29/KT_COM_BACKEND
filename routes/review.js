const express = require('express');
const con = require('../connection');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const exec = require('child_process').exec;
const shell = require('shelljs');


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

router.get("/",function(req, res, next){
	console.log("read");
	var id = req.query.id,
	mode = req.query.mode,
	deptId = req.query.deptId;
	console.log(id); // 1: 나만보기, 2: 부서공개, 3: 전체공개
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

router.get("/download",function(req,res,next) {
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

router.post("/", upload.single('userfile'),function(req, res, next) {
	console.log("upload code for review");
	console.log(req.body);
	var newDate = new Date();
	var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
	var time2 = newDate.toFormat('YYMMDDHH24MISS');
	var writer = req.body.id,
	writetime = time;
	if(req.file==null)
		res.send({"status":"none"});
	else {
		var filepath = req.file.path,
		originalname = req.file.originalname; // rename을 위한 original name 저장(확장자까지 저장됨)
		console.log("origin : "+filepath);
		console.log(originalname);
		var file_path = '/root/kt/routes/uploads/'+writer+'/'+time2;
		console.log(file_path);
		fs.stat('/root/kt/routes/uploads/'+writer,(err) => {
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
			else {
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
		
		var path2 = file_path+"/"+originalname;
		console.log(path2);
		var link = "https://sonarcloud.io/dashboard?id="+writer+"-"+originalname;
		var params = [writer, writetime, path2, originalname,link];
		console.log(params);
		var sql = 'INSERT INTO 코드 (작성자, 작성시간, 파일경로,파일명,링크) VALUES (?,?,?,?,?)';
		con.query(sql, params, function(err, result, fields) {
			if(err) console.log(err);
//			else res.send({"status":"success"});
			else {
				//Sonar-Scanner
				//TODO : project를 마음대로 생성할 수 있는지? -> 완료
				//TODO : zip과 code 형식을 분기하여 처리하면 좋을 듯
				console.log(result);
				shell.cd(file_path);
				console.log(path.extname(originalname));
				if(path.extname(originalname)==".zip") // 확장자가 zip이면
					shell.exec("unzip "+originalname); // 압축해제를 먼저 해준다
				console.log("???");
				shell.exec("sonar-scanner -Dsonar.projectKey="+writer+"-"+originalname+" -Dsonar.organization=kt -Dsonar.host.url=https://sonarcloud.io -Dsonar.login=982cf3839f11d609e7e510c32eb4459e93bb743b");
				res.send({
					"status":"success",
					"link":"https://sonarcloud.io/dashboard?id="+writer+"-"+originalname // TODO : dashboard 링크를 주자->완료
				});
			}
		});
	}
});

router.delete("/", function(req,res,next) {
	var id = req.query.id;
	var sql = "DELETE FROM 코드 where 코드번호=?";
	con.query(sql,id,function(err, result, fields) {
		if(err) throw err;
		else {
			res.send({"status":"success"});
		}
	});
});

module.exports = router;
