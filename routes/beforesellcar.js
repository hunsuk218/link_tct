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

    fs.readFile('views/beforesellcar.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {
            var accountaddr = req.body.accountaddr;

            pool.query('SELECT * FROM user;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!");
                } else {

                    var contractaddr2 = results[0].contractaddr;
                    pool.query("SELECT * FROM carinfo WHERE accountaddr = '" + contractaddr2 + "' AND status = '거래전'", (error, results) => {
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
