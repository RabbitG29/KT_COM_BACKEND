const express = require('express');
const con = require('../connection');
const router = express.Router();

router.get("/login", function(req,res,next) {
	console.log("login");
	// 일단은 단순하게 로그인 기능
	var id = req.query.id,
	password = req.query.password;
	console.log(req.query);
	var sql = 'select * from 사원 where 사번=?';
	con.query(sql,id,function(err, result, fields) {
		if(err) throw err;
		console.log(result);
		if(result.length!=0) {
			if(result[0].비밀번호==password) {
				
				res.send({
						"status":"success",
						"id":id,
						"name":result[0].이름,
						"deptId":result[0].소속부서
						});
			}
			else
				res.send({"status":"fail"});
		}
		else
			res.send({"status":"none"});
	});
});

//부서 조회
router.get("/depts",function(req,res,next) {
	console.log("dept list");
	var sql = "select * from 부서";
	con.query(sql,function(err,result,fields) {
		if(err) throw err;
		res.send({
			"status":"success",
			result:JSON.stringify(result)
		});
	});
});

module.exports = router;
