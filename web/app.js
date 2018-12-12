var createError = require('http-errors');
var logger = require('morgan');
var express = require('express');
var http = require('http');
var path = require('path');
var $ = require("jquery");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var mysql = require('mysql');



var index = require('./routes/index');
var addrepair = require('./routes/addrepair');
var addrepaircheck = require('./routes/addrepaircheck');
var buycar = require('./routes/buycar');
var enrollcar = require('./routes/enrollcar');
var info = require('./routes/info');
var login = require('./routes/login');
var mypage = require('./routes/mypage');
var repair = require('./routes/repair');
var repairinfo = require('./routes/repairinfo');
var searchrepairinfo = require('./routes/searchrepairinfo');
var sellcar = require('./routes/sellcar');
var loading = require('./routes/loading');
var success = require('./routes/success');
var enrollloading = require('./routes/enrollloading');
var enrollsuccess = require('./routes/enrollsuccess');
var beforesellcar = require('./routes/beforesellcar');
var selldetail = require('./routes/selldetail');
var buydetail = require('./routes/buydetail');
var escrowloading = require('./routes/escrowloading');
var escrowsuccess = require('./routes/escrowsuccess');
var depositloading = require('./routes/depositloading');
var depositsuccess = require('./routes/depositsuccess');
var buyerapprove = require('./routes/buyerapprove');
var sellerapprove = require('./routes/sellerapprove');
var repairapprove = require('./routes/repairapprove');
var search = require('./routes/search');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/addrepair', addrepair);
app.use('/addrepaircheck', addrepaircheck);
app.use('/buycar', buycar);
app.use('/enrollcar', enrollcar);
app.use('/info', info);
app.use('/login', login);
app.use('/mypage', mypage);
app.use('/repair', repair);
app.use('/repairinfo', repairinfo);
app.use('/searchrepairinfo', searchrepairinfo);
app.use('/sellcar', sellcar);
app.use('/loading', loading);
app.use('/success', success);
app.use('/enrollloading', enrollloading);
app.use('/enrollsuccess', enrollsuccess);
app.use('/beforesellcar', beforesellcar);
app.use('/selldetail', selldetail);
app.use('/buydetail', buydetail);
app.use('/escrowloading', escrowloading);
app.use('/escrowsuccess', escrowsuccess);
app.use('/depositloading', depositloading);
app.use('/depositsuccess', depositsuccess);
app.use('/buyerapprove', buyerapprove);
app.use('/sellerapprove', sellerapprove);
app.use('/repairapprove', repairapprove);
app.use('/search', search);

// catch 404 and , forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//===== 서버 시작 =====//

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});
