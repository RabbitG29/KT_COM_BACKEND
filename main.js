/**
 * main 파일입니다.
 * @main
**/  

const hostname = "0.0.0.0";
const port = "80";

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const con = require("./connection.js");
const dateUtils = require("date-utils");
const bodyParser= require("body-parser");
const path = require('path');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const compression = require('compression');

const options = {
	swaggerDefinition: {
		info:{
			title: "KTCC",
			version: "v1.0.0",
		},
		host: 'http://45.119.147.154:3001',
		basePath: '/'
	},
	apis: [
		'./routes/*.js','./routes/board/*.js'
	]
}

const swaggerSpec = swaggerJsdoc(options);
const customCss = {
	customCss: ".opbloack-summary-description {text-align: right}"
}
app.use(compression());
app.use('/api-swagger',swaggerUi.serve, swaggerUi.setup(swaggerSpec, customCss));

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('static'));
//app.use('/swagger-ui', express.static(path.join(__dirname,'./node_modules/swagger-ui/dist')));
//app.use('/api-docs',swaggerUi.serve);
//app.get('/api-docs',swaggerUi.setup(swaggerDocument));
con.connect(function(err) {
	if(err) throw err;
	console.log("mysql connected");
});

app.get("/", function(req, res) {
	/**
	 * main으로 rendering해줍니다.
	 * @param message {string} 출력해줄 메시지입니다.
	**/
	console.log("home");
	res.render("./static/index");
});

app.use('/v1/swagger.json',function(req,res) {
	res.json(require('./swagger.json'));
});

app.use('/swagger',function(req,res) {
	console.log("hi");
	res.redirect('/swagger-ui?url=v1/swagger.json');
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
