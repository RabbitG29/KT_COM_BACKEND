const mysql = require("mysql");
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "aksfnghafjs1",
	database: "kt",
	multipleStatements: true
});

module.exports = con;
