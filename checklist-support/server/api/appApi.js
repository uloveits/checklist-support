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

// 增加app
router.post('/addApp', (req, res) => {
    var sql = $sql.app.addApp;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.appId, params.appName, params.appUser, params.version,getNowFormatDate()], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//获得app
router.post('/getApp', (req, res) => {
  var sql = $sql.app.getApp;
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//添加app的控件
router.post('/addAppCtrl', (req, res) => {
  var sql = $sql.appCtrl.addAppCtrl;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.id, params.appId, params.ctrlId, params.testName,getNowFormatDate()], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//获得app的控件一览
router.post('/getAppCtrl', (req, res) => {
  var sql = $sql.appCtrl.getAppCtrl;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.appId], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//test添加
router.post('/addAppTest', (req, res) => {
  var sql = $sql.appTest.addAppTest;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.id, params.appId, params.ctrlId, params.caseId], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

router.post('/getAppTest', (req, res) => {
  var sql = $sql.appTest.getAppTest;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.appId], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

router.post('/getAppTestExport', (req, res) => {
  var sql = $sql.appTest.getAppTestExport;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.appId], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});


//获得appTest的count
router.post('/getAppTestCount', (req, res) => {
  var sql = $sql.appTest.getAppTestCount;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.appId,params.ctrlId, params.caseId,params.testName], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//update appTest
router.post('/updateAppTest', (req, res) => {
  var sql = $sql.appTest.updateAppTest;
  var params = req.body;
  var time1 = null;
  var time2 = null;
  console.log(params);
  if(params.result1 != null) {
    time1 = getNowFormatDate();
  }
  if(params.result2 != null) {
    time2 = getNowFormatDate();
  }
  conn.query(sql, [params.note,params.result1,time1,params.result2,time2,params.appId,params.ctrlId, params.caseId,params.testName], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

//
router.post('/insertAppTest', (req, res) => {
  var sql = $sql.appTest.insertAppTest;
  var params = req.body;
  var time1 = null;
  var time2 = null;
  console.log(params);
  if(params.result1 != null) {
    time1 = getNowFormatDate();
  }
  if(params.result2 != null) {
    time2 = getNowFormatDate();
  }
  conn.query(sql, [params.id,params.appId,params.ctrlId, params.caseId,params.testName,params.note,params.result1,time1,params.result2,time2], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

module.exports = router;
