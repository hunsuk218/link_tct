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

router.post('/', function (req, res, next) {
    //  res.render('buycar', { title: 'Express' });
    fs.readFile('views/search.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {

            var brand = req.body.maker;
            var accountaddr = req.body.accountaddr;
            console.log(brand);
            console.log(accountaddr);
            pool.query('SELECT * FROM user;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!");
                } else {

                    var contractaddr2 = results[0].contractaddr;
                    pool.query("SELECT * FROM car WHERE brand = '" + brand + "' AND status in ('거래전','거래대기','거래중');", (error, results) => {
                        if (error) {
                            console.log("DB Error..!!");
                        } else {
                            res.send(ejs.render(data, {
                                cars: results,
                                contractaddr: contractaddr2
                            }));
                        }
                    });


                }
            });
        }
    });
});

module.exports = router;
