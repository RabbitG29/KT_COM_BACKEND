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
	var id = req.query.id;
	console.log(id);
	var sql = "SELECT 코드.*, 사원.이름 from 코드 JOIN 사원 ON 사원.사번=코드.작성자 AND 코드.작성자=? ORDER BY 코드.작성시간 DESC";
	con.query(sql,id,function(err, result, fields) {
		if(err) throw err;
		else {
			res.send({
				"status":"success",
				result:JSON.stringify(result)
			});
		}
	});
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
		console.log(originalname);
		var file_path = '/root/kt/routes/uploads/'+writer+'/'+time2;
		console.log(file_path);
		fs.mkdir(file_path, {recursive:true}, (err) => {
			if(err) throw err;
			else console.log("make dir");
			fs.rename(filepath, file_path+"/"+originalname,(err) =>{
				if(err) throw err;
			});
			console.log(file_path);
		});
		var path = file_path+"/"+originalname;
		var link = "https://sonarcloud.io/dashboard?id="+writer+"-"+originalname;
		console.log(path);
		var params = [writer, writetime, path, originalname,link];
		var sql = 'INSERT INTO 코드 (작성자, 작성시간, 파일경로,파일명,링크) VALUES (?,?,?,?,?)';
		con.query(sql, params, function(err, result, fields) {
			if(err) throw err;
//			else res.send({"status":"success"});
			else {
				//Sonar-Scanner
				//TODO : project를 마음대로 생성할 수 있는지? -> 완료
				//TODO : zip과 code 형식을 분기하여 처리하면 좋을 듯
				shell.cd(file_path);
				if(path.extname(file_path)==".zip") // 확장자가 zip이면
					shell.exec("unzip "+originalname); // 압축해제를 먼저 해준다
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
