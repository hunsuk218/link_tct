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
    var contractaddr = req.query.contractaddr;

    fs.readFile('views/index.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {

            if (contractaddr == undefined) {
                pool.query('SELECT * FROM user;', (error, results) => {
                    if (error) {
                        console.log("DB Error..!!");
                    } else {

                        var contractaddr2 = results[0].contractaddr;
                        pool.query('SELECT * FROM car;', (error, results) => {
                            if (error) {
                                console.log("DB Error..!!");
                            } else {
                                res.send(ejs.render(data, {
                                    cars: results,
                                    errorFlag: flag,
                                    contractaddr: contractaddr2
                                }));
                            }
                        });
                    }
                });
            } else {
                pool.query("UPDATE user SET contractaddr = '" + contractaddr + "'", function (err, rows) {
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {

                        pool.query('SELECT * FROM user;', (error, results) => {
                            if (error) {
                                console.log("DB Error..!!");
                            } else {

                                var contractaddr2 = results[0].contractaddr;
                                pool.query('SELECT * FROM car;', (error, results) => {
                                    if (error) {
                                        console.log("DB Error..!!");
                                    } else {
                                        res.send(ejs.render(data, {
                                            cars: results,
                                            errorFlag: flag,
                                            contractaddr: contractaddr2
                                        }));
                                    }
                                });
                            }
                        });

                    }
                });
            }
        }
    });
});







module.exports = router;
