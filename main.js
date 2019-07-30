const hostname = "0.0.0.0";
const port = "3000";

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const con = require("./connection.js");
const dateUtils = require("date-utils");
const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(cors());

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

const server = app.listen(port, hostname, () => {
	console.log("Server running");
});

app.use('/users',userRouter);
app.use('/review',reviewRouter);
