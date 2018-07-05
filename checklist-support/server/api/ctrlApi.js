/**
 * Created by 网线丶 on 2018/6/23.
 */
var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var getNowFormatDate = function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strMinutes >= 1 && strMinutes <= 9) {
      strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
      strSeconds = "0" + strSeconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
}
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 查看所有的控件
router.post('/getCtrl', (req, res) => {
    var sql = $sql.ctrl.getCtrl;
    conn.query(sql, [], function(err, result) {

        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

//增加控件
router.post('/addCtrl', (req, res) => {
    var sql = $sql.ctrl.addCtrl;
    var params = req.body;
    console.log(params);
    console.log(getNowFormatDate());
    conn.query(sql, [params.ctrlName,getNowFormatDate()], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});


// 查看指定控件的所有case
router.post('/getCtrlCase', (req, res) => {
  var sql = $sql.case.getCtrlCase;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.ctrlId], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//增加控件的Case
router.post('/addCtrlCase', (req, res) => {
  var sql = $sql.case.addCtrlCase;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.caseId,params.ctrlId,params.caseInfo,getNowFormatDate()], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});



module.exports = router;
