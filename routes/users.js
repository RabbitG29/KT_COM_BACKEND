/**
 * login 파일입니다.
 * @api login
**/

const express = require('express');
const con = require('../connection');
const router = express.Router();
const sha256 = require('sha256');
const { check, validationResult } = require('express-validator');
/**
* @swagger
*
* /users/login:
*   get:
*     summary: 사번을 이용한 로그인
*     tags:
*       - login
*     description: 로그인
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         in: query
*         type: integer
*         description: 사번
*       - name: password
*         in: query
*         type: string
*         description: 비밀번호, SHA-256으로 암호화
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
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
				con.query(sql2,params,function(err2,result,fields) {
					if(err2) throw err2;
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
/**
* @swagger
*
* /users/depts:
*   get:
*     summary: 부서 목록 조회
*     tags:
*       - depts
*     description: 부서 목록 조회
*     produces:
*       - application/json
*     responses:
*       200:
*         description: 통신 성공
*       424:
*         description: parameter가 유효하지 않음
*/
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
