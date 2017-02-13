var json = require("json"),
    mysql = require('mysql'),
    http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    gutil = require('gulp-util'),
    cookieParser = require('cookie-parser');

global.router = express.Router();
global.app = express();

global.database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydb'
});

database.connect(function(error) {
    if (error) {
        console.log('database connection problem!');
    } else {
        console.log('database works!');
    }
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type, Accept');
    next();
});

app.use(cookieParser('my secret here'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Links
var questions = require('./questions.js');

app.listen(9090);