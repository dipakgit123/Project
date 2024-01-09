var mysql= require("mysql");
var util = require("util");

const conn=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'',
    database:'node_course_project'
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
