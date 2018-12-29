var express = require('express');
var router = express.Router();
var fs = require('fs');
var ejs = require('ejs');
const mysql = require('mysql');
var multer = require('multer');
var path = require("path");



var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images/uploads");
    },
    filename: function (req, file, callback) {
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        callback(null, basename + extension);
    }
});

var upload = multer({
    storage: storage
});

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'wkehdck',
    database: 'blockcar',
    debug: false
});



router.post('/addcar', upload.array('photo', 10), (req, res) => {
    var accountaddr = req.body.accountaddr;
    console.log(accountaddr);
    var files = req.files;
    var wholenumber = req.body.wholenumber;
    var price = req.body.price;
    var carnum = req.body.carnum;
    var accident = req.body.accident;
    var distance = req.body.distance;
    var location = req.body.location;
    var etc = req.body.etc;
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
    var dealnumber = req.body.dealnumber;
    var escrownumber = req.body.escrownumber;
    var status = req.body.status;

    let filepath = [];
    console.log(req.files);
    console.log(accident);
    for (i in files) {
        console.log(files[i].originalname);
        filepath.push("images/uploads/" + files[i].originalname);
    }

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


    var query2 = pool.query("SELECT count(*) FROM car WHERE wholenumber = '" + wholenumber + "' OR carnum = '" + carnum + "'", (error, results) => {

        result = results[0]['count(*)'];
        if (error) {
            console.log("DB Error..!");
        } else if (result == 1)

        {

            res.send('<script type="text/javascript">alert("이미 등록된 차량이 있습니다.");</script>');



        } else {

            var query2 = pool.query("UPDATE carinfo SET status=1 WHERE wholenumber = '" + wholenumber + "'", (error, results) => {
                if (error) {
                    console.log("DB Error..!");
                } else {
                    pool.query("UPDATE escrow SET i = '" + escrownumber + "'", function (err, rows) {

                        if (err) {
                            console.log("DB Error..!");
                        } else {


                            var query = pool.query('insert into car (wholenumber, price, carnum, accident, distance, location, etc, nation, brand, cartype, model, detailmodel, carbody , safety, engine, checkbox, year, factory, producenumber, filepath1, filepath2, filepath3, filepath4, filepath5, filepath6, accountaddr, dealnumber, escrownumber, status) values ("' + wholenumber + '","' + price + '","' + carnum + '","' + accident + '","' + distance + '","' + location + '","' + etc + '","' + nation + '","' + brand + '", "' + cartype + '", "' + model + '", "' + detailmodel + '", "' + carbody + '", "' + safety + '", "' + engine + '", "' + checkbox + '", "' + year + '", "' + factory + '", "' + producenumber + '", "' + filepath[0] + '", "' + filepath[1] + '", "' + filepath[2] + '", "' + filepath[3] + '", "' + filepath[4] + '", "' + filepath[5] + '", "' + accountaddr + '", "' + dealnumber + '", "' + escrownumber + '", "' + status + '")', function (err, rows) {
                                if (err) {
                                    throw err;
                                }
                                console.log("Data inserted!");
                                res.redirect('/');

                            });
                        }
                    });
                }


            });


        }



    });

})


router.post('/', function (req, res, next) {

    var sellcar = req.body.sellcar;

    pool.query('SELECT * FROM user;', (error, results) => {
        if (error) {
            console.log("DB Error..!!");
        } else {
            var contractaddr2 = results[0].contractaddr;
            pool.query('SELECT * FROM escrow;', (error, results) => {
                if (error) {
                    console.log("DB Error..!!2");
                } else {

                    var escrownumber = null;
                    escrownumber = results[0].i;



                    var query8 = pool.query("SELECT carnum FROM carinfo WHERE wholenumber = '" + sellcar + "'", function (err, rows) {

                        var carnum = null;
                        if (err) {
                            throw err;
                        }
                        carnum = rows[0].carnum;
                        console.log(carnum);
                        res.render('sellcar', {
                            sellcar: sellcar,
                            carnum: carnum,
                            contractaddr: contractaddr2,
                            escrownumber: escrownumber
                        });
                    });

                }
            });

        }
    });

});



module.exports = router;
