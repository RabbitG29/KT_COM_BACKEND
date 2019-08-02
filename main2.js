const hostname = "0.0.0.0";
const port = "3001";

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const con = require("./connection.js");
const dateUtils = require("date-utils");
const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('static'));

con.connect(function(err) {
	if(err) throw er;
	console.log("mysql connected");
});

app.get("/", function(req, res) {
	console.log("home");
	res.render('./static/index');
});

const userRouter = require('./routes/users');
const reviewRouter = require('./routes/review');
const boardRouter = require('./routes/board');

const server = app.listen(port, hostname, () => {
	console.log("Server running");
});

app.use('/users',userRouter);
app.use('/review',reviewRouter);
app.use('/board',boardRouter);
