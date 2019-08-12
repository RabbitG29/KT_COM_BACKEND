const express = require('express');
const con = require('../connection');
const router = express.Router();
const sha256 = require('sha256');
const { check, validationResult } = require('express-validator');

router.get("/login", [check('id').isInt(),check('password').isLength({min:5})], function(req,res,next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("login");
	// 일단은 단순하게 로그인 기능
	var id = req.query.id,
	password = req.query.password;
	
	console.log(check('id').isInt());
	console.log(req.query);
	var sql = 'select * from 사원 where 사번=?';
	con.query(sql,id,function(err, result, fields) {
		if(err) throw err;
		if(result.length!=0) {
			var crypto = sha256.x2(password);
			var crypto2 = sha256.x2(result[0].비밀번호);
			var crypto3 = result[0].비밀번호;
			if(result[0].사번==result[0].비밀번호) {
				var sql2 = 'UPDATE 사원 SET 비밀번호=? WHERE 사번=?';
				var params = [crypto2,id];
				con.query(sql2,params,function(err,result2,fields) {
					if(err) throw err;
					if(crypto==crypto2) {				
						res.send({
							"status":"success",
							"id":id,
							"name":result[0].이름,
							"deptId":result[0].소속부서
						});
					}
				});
			}
			else if(crypto==crypto3) {				
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
