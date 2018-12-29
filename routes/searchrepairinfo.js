var express = require('express');
var router = express.Router();
var fs = require('fs');
var ejs = require('ejs');
const mysql = require('mysql');
//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'wkehdck',
    database: 'blockcar',
    debug: false
});

router.get('/', function (req, res, next) {
    var flag = req.query.flag;
    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!");
        } else {

            var contractaddr2 = results[0].contractaddr;
            res.render('searchrepairinfo', {
                errorFlag: flag,
                contractaddr: contractaddr2
            });
        }
    });
});






module.exports = router;
