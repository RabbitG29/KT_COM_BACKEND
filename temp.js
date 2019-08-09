const hostname = "0.0.0.0";
const port = "3002";

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const con = require("./connection.js");
const dateUtils = require("date-utils");
const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const myarray = ['0', 1, 2, '0', '0', 3];
const array2 = myarray.filter((item, index) => myarray.indexOf(item) !== index);
const array = [...new Set(myarray)];
console.log(array);
console.log(array2);
// ['0', '0']
con.connect(function(err) {
	if(err) throw er;
	console.log("mysql connected");
});

app.get("/", function(req, res) {
	console.log("home");
	res.send("hi");
});

const userRouter = require('./routes/users');
const reviewRouter = require('./routes/review');
const boardRouter = require('./routes/board');
const tagRouter = require('./routes/tag');

const server = app.listen(port, hostname, () => {
	console.log("Server running");
});

app.use('/users',userRouter);
app.use('/review',reviewRouter);
app.use('/board',boardRouter);
app.use('/tags',tagRouter);
