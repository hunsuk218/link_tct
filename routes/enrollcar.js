var express = require('express');
var router = express.Router();
var fs = require('fs');
var ejs = require('ejs');
const mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'wkehdck',
    database: 'blockcar',
    debug: false
});

router.get('/', function (req, res, next) {

    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!");
        } else {

            var contractaddr2 = results[0].contractaddr;
            res.render('enrollcar', {
                contractaddr: contractaddr2
            });
        }
    })
});



router.post('/enroll', (req, res) => {
    fs.readFile('views/enrollcar.ejs', 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File is Not Found..");
        } else {


            var wholenumber = req.body.wholenumber;
            var accountaddr = req.body.contractaddr;
            var carnum = req.body.carnum;

            var zero = wholenumber.substr(0, 1);
            var one = wholenumber.substr(1, 1);
            var two = wholenumber.substr(2, 1);
            var three = wholenumber.substr(3, 1);
            var four = wholenumber.substr(4, 1);
            var five = wholenumber.substr(5, 1);
            var six = wholenumber.substr(6, 1);
            var seven = wholenumber.substr(7, 1);
            var eight = wholenumber.substr(8, 1);
            var nine = wholenumber.substr(9, 1);
            var ten = wholenumber.substr(10, 1);
            var eleven = wholenumber.substr(11, 6);

            var nation = "";
            var brand = "";
            var cartype = "";
            var model = "";
            var detailmodel = "";
            var carbody = "";
            var safety = "";
            var engine = "";
            var checkbox = "";
            var year = "";
            var factory = "";
            var producenumber = "";
            var status = '거래전';

            if (wholenumber.length != 17) {
                console.log("17글자의 차대번호를 입력하세요!");
            } else {
                if (zero == "K") {
                    nation = "Korea";
                } else if (zero == "J") {
                    nation = "Japan";
                } else if (zero == "G") {
                    nation = "Germany";
                }



                if (one == "H") {
                    brand = "현대"
                } else if (one == "K") {
                    brand = "기아";
                } else if (one == "G") {
                    brand = "제네시스"
                } else if (one == "W") {
                    brand = "BMW"
                } else if (one == "B") {
                    brand = "벤츠"
                } else if (one == "A") {
                    brand = "아우디"
                } else if (one == "L") {
                    brand = "렉서스"
                }

                if (two == "H") {
                    cartype = "승용차";
                } else if (two == "F") {
                    cartype = "화물트럭";
                } else if (two == "J") {
                    cartype = "승합차량";
                }

                if (three == "V") {
                    model = "아반떼 스포츠";
                } else if (three == "K") {
                    model = "K5";
                } else if (three == "L") {
                    model = "LF소나타"
                } else if (three == "G") {
                    model = "EQ 900"
                } else if (three == "X") {
                    model = "X5"
                } else if (three == "E") {
                    model = "E클래스"
                } else if (three == "A") {
                    model = "A8"
                } else if (three == "S") {
                    model = "렉서스 GS"
                }

                if (four == "L") {
                    detailmodel = "표준기본사양";
                } else if (four == "M") {
                    detailmodel = "고급사양";
                } else if (four == "X") {
                    detailmodel = "최고급사양";
                }

                if (five == "1") {
                    carbody = "리무진";
                } else if (five == "2" || five == "3" || five == "4" || five == "5") {
                    carbody = "DOOR수";
                } else if (five == "6") {
                    carbody = "쿠페";
                } else if (five == "8") {
                    carbody = "왜건";
                }

                if (six == "1") {
                    safety = "장치없음";
                } else if (six == "2") {
                    safety = "수동안전띠";
                } else if (six == "3") {
                    safety = "자동안전띠";
                } else if (six == "4") {
                    safety = "에어백";
                }

                if (seven == "A") {
                    engine = "1,800CC";
                } else if (seven == "B") {
                    engine = "2,000CC";
                } else if (seven == "G") {
                    engine = "2,500CC";
                }

                if (eight == "P") {
                    checkbox = "LHD";
                } else if (eight == "R") {
                    checkbox = "RHD";
                }

                if (nine == "A") {
                    year = "2010";
                } else if (nine == "B") {
                    year = "2011";
                } else if (nine == "C") {
                    year = "2012";
                } else if (nine == "D") {
                    year = "2013";
                } else if (nine == "E") {
                    year = "2014";
                } else if (nine == "F") {
                    year = "2015";
                } else if (nine == "G") {
                    year = "2016";
                } else if (nine == "H") {
                    year = "2017";
                } else if (nine == "I") {
                    year = "2018";
                }

                if (ten == "A") {
                    factory = "아산공장";
                } else if (ten == "B") {
                    factory = "전주공장";
                } else if (ten == "C") {
                    factory = "울산공장";
                } else if (ten == "D") {
                    factory = "인도공장";
                } else if (ten == "E") {
                    factory = "터키공장";
                } else if (ten == "F") {
                    factory = "독일공장";
                } else if (ten == "G") {
                    factory = "일본공장";
                }



                producenumber = eleven;


                console.log('wholenumber : ' + wholenumber + " / nation : " + nation + " / brand : " + brand + " / cartype : " + cartype + " / model : " + model + " / detailmodel : " + detailmodel + " / carbody : " + carbody + " / safety : " + safety + " / engine : " + engine + " / checkbox : " + checkbox + " / year : " + year + " / factory : " + factory + " / producenumber : " + producenumber + " / accountaddr : " + accountaddr + " / carnum : " + carnum);

                var query = pool.query('insert into carinfo (wholenumber, nation, brand, cartype, model, detailmodel, carbody, safety, engine, checkbox, year, factory, producenumber,accountaddr,carnum, status) values ("' + wholenumber + '","' + nation + '","' + brand + '", "' + cartype + '", "' + model + '", "' + detailmodel + '", "' + carbody + '", "' + safety + '", "' + engine + '", "' + checkbox + '", "' + year + '", "' + factory + '", "' + producenumber + '", "' + accountaddr + '", "' + carnum + '", "' + status + '")', function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    console.log("Data inserted!");


                    res.redirect('/enrollcar');
                });
            }


        }
    });


});





module.exports = router;
