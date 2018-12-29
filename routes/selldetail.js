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
    var wholenumber = req.body.wholenumber;
    var dealnumber = req.body.dealnumber;

    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!1");
        } else {
            var contractaddr2 = results[0].contractaddr;
            pool.query('SELECT * FROM escrow;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!2");
                } else {

                    var escrownumber = null;
                    escrownumber = results[0].i;

                    var query = pool.query("SELECT * from car WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

                        if (err) {
                            console.log(err);
                            throw err;

                        } else {

                            var price = null;
                            var accountaddr = null;
                            var buyeraddr = null;
                            var nation = null;
                            var brand = null;
                            var cartype = null;
                            var model = null;
                            var detailmodel = null;
                            var carbody = null;
                            var safety = null;
                            var engine = null;
                            var checkbox = null;
                            var year = null;
                            var factory = null;
                            var producenumber = null;
                            var status = null;
                            var escrownumber1 = null;


                            price = rows[0].price;
                            accountaddr = rows[0].accountaddr;
                            buyeraddr = rows[0].buyeraddr;
                            nation = rows[0].nation;
                            brand = rows[0].brand;
                            cartype = rows[0].cartype;
                            model = rows[0].model;
                            detailmodel = rows[0].detailmodel;
                            carbody = rows[0].carbody;
                            safety = rows[0].safety;
                            engine = rows[0].engine;
                            checkbox = rows[0].checkbox;
                            year = rows[0].year;
                            factory = rows[0].factory;
                            producenumber = rows[0].producenumber;
                            status = rows[0].status;
                            escrownumber1 = rows[0].escrownumber;


                            res.render('selldetail', {
                                price: price,
                                accountaddr: accountaddr,
                                buyeraddr: buyeraddr,
                                nation: nation,
                                brand: brand,
                                cartype: cartype,
                                model: model,
                                detailmodel: detailmodel,
                                carbody: carbody,
                                safety: safety,
                                engine: engine,
                                checkbox: checkbox,
                                year: year,
                                factory: factory,
                                producenumber: producenumber,
                                wholenumber: wholenumber,
                                status: status,
                                escrownumber: escrownumber,
                                contractaddr: contractaddr2,
                                escrownumber1: escrownumber1

                            });
                        }
                    });

                }



            });
        }
    });

});


router.post('/sellstart', function (req, res, next) {
    var escrownumber = req.body.escrownumber;
    var wholenumber = req.body.wholenumber;
    var count = req.body.count;


    var query2 = pool.query("UPDATE car SET status = '거래중', escrownumber = '" + count + "' WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

        if (err) {
            console.log("DB Error..!");
        } else {


            res.redirect('/mypage');


        }


    });




});


module.exports = router;
