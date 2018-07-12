/**
 * Created by 网线丶 on 2018/6/23.
 */
// sql语句
var sqlMap = {
    // 控件和case
    ctrl: {
        getCtrl:"select * from controls where delFlag = '0' order by updateTime asc",
        addCtrl:"insert into controls(ctrlName, delFlag, updateTime) values (?, 0, ?)"
    },
    case: {
        getCtrlCase:"select * from ctrlCase where ctrlId = ? and delFlag = '0' order by updateTime asc",
        addCtrlCase:"insert into ctrlCase(caseId,ctrlId,caseInfo, delFlag,updateTime) values (?,?,?, 0, ?)"
    },
    //App
    app: {
        getApp:"select * from app where delFlag = '0' order by updateTime asc ",
        addApp:"insert into app(appId,appName,appUser, version,delFlag,updateTime) values (?,?,?,?, 0,?)"
    },
    appCtrl: {
        getAppCtrl:" select" +
                       " A.id," +
                       " A.ctrlId," +
                       " C.ctrlName," +
                       " A.testName" +
                    " from appctrl A left join controls C" +
                       " on A.ctrlId = C.id" +
                    " where A.appId = ? and A.delFlag = '0' order by A.updateTime asc ",
        addAppCtrl:"insert into appctrl(id,appId,ctrlId,testName,delFlag,updateTime) values (?,?,?,?, 0,?)"
    },
    appTest: {
        addAppTest:"insert into apptest(id,appId,ctrlId,caseId,explorer) values (?,?,?,?,'IE')",
        getAppTest:" select DISTINCT" +
                          " A.id," +
                          " A.ctrlId," +
                          " C.ctrlName," +
                          " A.testName,"  +
                          " Ca.caseId," +
                          " Ca.caseInfo," +
                          " Ap.version," +
                          " Ap.appUser," +
                          " Ap.appName," +
                          " T.explorer," +
                          " T.note," +
                          " T.result1," +
                          " T.time1," +
                          " T.result2," +
                          " T.time2" +
                    " from appctrl A left join controls C" +
                    " on A.ctrlId = C.id" +
                    " left join ctrlcase Ca" +
                    " on C.id = Ca.ctrlId" +
                    " left join apptest T" +
                    " on (A.ctrlId = T.ctrlId and A.appId = T.appId and Ca.caseId = T.caseId and A.testName = T.testName and A.id = T.appctrlId)" +
                    " left join app Ap" +
                    " on (A.appId = Ap.appId)" +
                    " where A.appId = ? and A.delFlag = '0' and C.delFlag = '0' and Ca.delFlag = '0'and Ap.delFlag = '0' " +
                    " order by A.updateTime asc,Ca.updateTime asc",
        getAppTestExport:" select DISTINCT" +
                                  " A.id," +
                                  " A.ctrlId," +
                                  " C.ctrlName," +
                                  " A.testName,"  +
                                  " Ca.caseId," +
                                  " Ca.caseInfo," +
                                  " Ap.version," +
                                  " Ap.appUser," +
                                  " Ap.appName," +
                                  " T.explorer," +
                                  " T.note," +
                                  " T.result1," +
                                  " T.time1," +
                                  " T.result2," +
                                  " T.time2" +
                          " from appctrl A left join controls C" +
                          " on A.ctrlId = C.id" +
                          " left join ctrlcase Ca" +
                          " on C.id = Ca.ctrlId" +
                          " left join apptest T" +
                          " on (A.ctrlId = T.ctrlId and A.appId = T.appId and Ca.caseId = T.caseId and A.testName = T.testName and A.id = T.appctrlId)" +
                          " left join app Ap" +
                          " on (A.appId = Ap.appId)" +
                          " where A.appId = ? and A.delFlag = '0' and C.delFlag = '0' and Ca.delFlag = '0'and Ap.delFlag = '0' " +
                          " order by A.updateTime asc,Ca.updateTime asc",
        updateAppTest:" update apptest set note = ?, result1 = ?, time1 = ?, result2 = ? ,time2 = ?" +
                        " where appId = ? and ctrlId = ? and caseId = ? and appctrlId = ?",
        insertAppTest:" insert into apptest(id, appId,appctrlId,ctrlId,caseId,testName,explorer,note,result1,time1,result2,time2) values (?,?,?,?,?,?,'IE',?,?,?,?,?)",
        getAppTestCount:"select count(*) as count from apptest where appId = ? and ctrlId = ? and caseId = ? and appctrlId = ?"
    }
}

module.exports = sqlMap;
