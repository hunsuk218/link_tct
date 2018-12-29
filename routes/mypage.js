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



    fs.readFile('views/mypage.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {
            var accountaddr = req.body.accountaddr;
            console.log(accountaddr + "hohoho");
            pool.query('SELECT * FROM user;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!");
                } else {

                    var contractaddr2 = results[0].contractaddr;
                    pool.query("SELECT * FROM car WHERE accountaddr = '" + contractaddr2 + "'", (error, results) => {
                        if (error) {
                            console.log("DB Error..!!");
                        } else {
                            pool.query("SELECT * FROM car WHERE buyeraddr = '" + contractaddr2 + "'", (error, results2) => {

                                if (error) {
                                    console.log("DB Error..!!");
                                } else {

                                    var selleraddr = [];


                                    for (var i = 0; i < results2.length; i++) {
                                        selleraddr.push = results2[i].acccountaddr


                                    }

                                    res.send(ejs.render(data, {
                                        sell: results,
                                        buy: results2,
                                        accountaddr: accountaddr,
                                        contractaddr: contractaddr2
                                    }));

                                }

                            });
                        }
                    });

                }
            });
        }
    })
});



router.post('/', function (req, res, next) {



    fs.readFile('views/mypage.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {
            var accountaddr = req.body.accountaddr;
            console.log(accountaddr + "hohoho");
            pool.query('SELECT * FROM user;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!");
                } else {

                    var contractaddr2 = results[0].contractaddr;
                    pool.query("SELECT * FROM car WHERE accountaddr = '" + contractaddr2 + "'", (error, results) => {
                        if (error) {
                            console.log("DB Error..!!");
                        } else {
                            pool.query("SELECT * FROM car WHERE buyeraddr = '" + contractaddr2 + "'", (error, results2) => {

                                if (error) {
                                    console.log("DB Error..!!");
                                } else {

                                    var selleraddr = [];


                                    for (var i = 0; i < results2.length; i++) {
                                        selleraddr.push = results2[i].acccountaddr


                                    }

                                    res.send(ejs.render(data, {
                                        sell: results,
                                        buy: results2,
                                        accountaddr: accountaddr,
                                        contractaddr: contractaddr2
                                    }));

                                }

                            });
                        }
                    });

                }
            });
        }
    })
});

router.post('/changeprice', function (req, res, next) {

    var price = req.body.price;
    var wholenumber = req.body.wholenumber;

    var query2 = pool.query("UPDATE car SET price = '" + price + "' WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

        if (err) {
            console.log(err);
            throw err;
        } else {

            res.redirect('/');

        }
    })



});

router.post('/cancel', function (req, res, next) {


    var wholenumber = req.body.wholenumber;

    var query2 = pool.query("UPDATE car SET buyeraddr = null, status='거래전' WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

        if (err) {
            console.log(err);
            throw err;
        } else {

            res.redirect('/');

        }
    })



});

module.exports = router;
