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
    var buyeraddr = req.body.accountaddr;
    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!");
        } else {

            var contractaddr2 = results[0].contractaddr;
            var query = pool.query("SELECT * FROM car WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {

                    var price = null;
                    var carnum = null;
                    var accident = null;
                    var distance = null;
                    var location = null;
                    var etc = null;
                    var filepath1 = null;
                    var filepath2 = null;
                    var filepath3 = null;
                    var filepath4 = null;
                    var filepath5 = null;
                    var filepath6 = null;
                    var accountaddr = null;
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
                    var carnum = null;
                    var wholenumber = null;
                    var dealnumber = null;
                    var escrownumber = null;
                    var date = null;
                    var status = null;

                    price = rows[0].price;
                    carnum = rows[0].carnum;
                    accident = rows[0].accident;
                    distance = rows[0].distance;
                    location = rows[0].location;
                    etc = rows[0].etc;
                    filepath1 = rows[0].filepath1;
                    filepath2 = rows[0].filepath2;
                    filepath3 = rows[0].filepath3;
                    filepath4 = rows[0].filepath4;
                    filepath5 = rows[0].filepath5;
                    filepath6 = rows[0].filepath6;
                    accountaddr = rows[0].accountaddr;
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
                    carnum = rows[0].carnum;
                    wholenumber = rows[0].wholenumber;
                    dealnumber = rows[0].dealnumber;
                    escrownumber = rows[0].escrownumber;
                    date = rows[0].dealnumber.substr(0, 4) + '/' + rows[0].dealnumber.substr(4, 2) + '/' + rows[0].dealnumber.substr(6, 2);
                    status = rows[0].status;


                    res.render('info', {
                        price: price,
                        carnum: carnum,
                        accident: accident,
                        distance: distance,
                        location: location,
                        etc: etc,
                        filepath1: filepath1,
                        filepath2: filepath2,
                        filepath3: filepath3,
                        filepath4: filepath4,
                        filepath5: filepath5,
                        filepath6: filepath6,
                        accountaddr: accountaddr,
                        list: rows,
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
                        carnum: carnum,
                        wholenumber: wholenumber,
                        producenumber: producenumber,
                        dealnumber: dealnumber,
                        escrownumber: escrownumber,
                        date: date,
                        accountaddr: accountaddr,
                        buyeraddr: buyeraddr,
                        status: status,
                        contractaddr: contractaddr2

                    });




                }


            });

        }
    });



})

router.post('/purchase', function (req, res, next) {
    var buyeraddr = req.body.buyeraddr;
    var wholenumber = req.body.wholenumber;



    console.log(buyeraddr);

    var query = pool.query("SELECT * FROM car WHERE wholenumber = '" + wholenumber + "'", function (err, row) {
        if (err) {
            console.log("DB Error..!");
        } else {

            var status = null;
            status = row[0].status;
            var selleraddr = null;
            selleraddr = row[0].accountaddr;

            if (buyeraddr == selleraddr) {
                res.redirect('/?flag=3');

            } else if ((buyeraddr != selleraddr) && status == "거래전") {


                var query2 = pool.query("UPDATE car SET buyeraddr = '" + buyeraddr + "' WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

                    if (err) {
                        console.log("DB Error..!");
                    } else {

                        var query3 = pool.query("UPDATE car SET status = '거래대기' WHERE wholenumber = '" + wholenumber + "'", function (err, rows) {

                            if (err) {
                                console.log("DB Error..!");
                            } else {


                                res.redirect('/');


                            }

                        });


                    }


                });

            } else {

                res.redirect('/?flag=1');
            }




        }
    });
});






module.exports = router;
