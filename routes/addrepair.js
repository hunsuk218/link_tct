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
    var carnum = req.body.carNum;
    console.log("car num : " + carnum);

    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!");
        } else {

            var contractaddr2 = results[0].contractaddr;

            var query = pool.query("SELECT * FROM carinfo WHERE wholenumber = '" + carnum + "'", function (err, rows) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    var emptyflag = true;
                    var nation = null;
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

                    if (rows.length > 0) {
                        emptyflag = false;

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

                        res.render('addrepair', {
                            carnum: carnum,
                            list: rows,
                            emptyFlag: emptyflag,
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
                            contractaddr: contractaddr2

                        });

                    } else {
                        emptyflag = true;
                        res.redirect('/repair?flag=1');
                    }


                }
            });
        }

    });




});

module.exports = router;
