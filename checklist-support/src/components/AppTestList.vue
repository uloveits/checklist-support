<template>
    <Content ref="elememt" :style="{background: '#fff', position: 'absolute',top: '80px',bottom: '30px', left: '20px', right:' 20px',overflow:'auto'}">
        <div style="padding:8px;">
            <Row>
                <Col span="24">
                    <div style="display:inline-block;vertical-align: middle;width:71px;">
                        <label>App名:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                         <Select v-model="appId" @on-change="appChange" style="width:200px">
                                 <Option v-for="item in appList" :value="item.appId" :key="item.appName">{{ item.appName }}</Option>
                         </Select>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                     <div style="display:inline-block;vertical-align: middle;">
                         <Button type="primary" @click="testSubmit">提交</Button>
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                     <Table ref="table" border :columns="appTestColumns" :data="appTestData" :height="tableHeight" size="small"></Table>
                </Col>
                <Col span="24" style="margin-top:10px;">
                    <Page ref="pager" :total="pageTotal" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="pageChange" size="small"
                          @on-page-size-change="pageSizeChange" show-elevator show-total show-sizer></Page>
                </Col>
            </Row>
        </div>
    </Content>
</template>
<style>
  .ivu-table td.demo-table-info-column{
    color: #000;
    font-size: 14px;
  }
  .ivu-table td.table-info-strong {
    color: #330099;
  }

</style>

<script>
    var arrSelectData = [];
    var arrSelectIndex = [];
    var arrSelectIndexRet2 = [];
    var arrSelectIndexSavedRet1  = [];
    var arrSelectIndexSavedRet2 = [];
    //获得uuid
     function uuid() {
         var s = [];
         var hexDigits = "0123456789abcdef";
         for (var i = 0; i < 36; i++) {
             s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
         }
         s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
         s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
         s[8] = s[13] = s[18] = s[23] = "-";

         var uuid = s.join("");
         return uuid;
     }
    export default {
        //组建渲染的时候执行
        created () {
            //获得app名Select数据
            this.$http.post('/api/app/getApp', {},{}).then((response) => {
                    if(response.ok) {
                        this.appList = response.body;
                    }
             });

             //初始化appTestColumns
            this.initAppTestColumns();

        },
         mounted() {
          // 设置表格高度
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 250
        },

      data () {
            return {
                appId:'',
                tableHeight:450,
                appList:[],
                appTestColumns:[],
                appTestData:[],
                pageTotal:0,
                pageSize:50,
                pageSizeOpts:[20,50,100]
            }
        },
        methods: {
          testSubmit() {
              let _this = this;
              var saveIndex = [];
              var j=0;
              var m=1;
              for(var i= 0;i< this.appTestData.length; i++) {
                  //数据库没有保存过数据（result1）
                  if((arrSelectIndexSavedRet1.indexOf(i) == -1  && this.appTestData[i].result1 != null && this.appTestData[i].result1 != "" )||
                   (this.appTestData[i].result1 == "NG" && this.appTestData[i].result2 != null && this.appTestData[i].result2 != "" && arrSelectIndexSavedRet2.indexOf(i) == -1) ){
                      saveIndex.push(i);
                      //判断这条数据apptest表中有没有
                      this.$http.post('/api/app/getAppTestCount', {
                           appId: this.appId,
                           ctrlId: this.appTestData[i].ctrlId,
                           caseId: this.appTestData[i].caseId,
                           appctrlId: this.appTestData[i].id,
                      },{}).then((response) => {
                          var n = saveIndex[j];

                          //数据库中有着条数据的情况

                          if(response.body[0].count > 0) {
                               this.$http.post('/api/app/updateAppTest', {
                                     note: _this.appTestData[n].note,
                                     result1: _this.appTestData[n].result1,
                                     result2: _this.appTestData[n].result2,
                                     appId: _this.appId,
                                     ctrlId: _this.appTestData[n].ctrlId,
                                     caseId: _this.appTestData[n].caseId,
                                     appctrlId:_this.appTestData[n].id,
                               },{}).then((response) => {
                                   if( m == saveIndex.length) {
                                      arrSelectIndex = [];
                                      arrSelectIndexRet2 = [];
                                      arrSelectIndexSavedRet1  = [];
                                      arrSelectIndexSavedRet2 = [];
                                       _this.appChange(this.$refs.pager.currentPage);
                                   }
                                    m++;
                               });
                          }else {
                              var testId = uuid();
                              this.$http.post('/api/app/insertAppTest', {
                                   id:testId,
                                   appId: _this.appId,
                                   appctrlId:_this.appTestData[n].id,
                                   ctrlId: _this.appTestData[n].ctrlId,
                                   caseId: _this.appTestData[n].caseId,
                                   testName:_this.appTestData[n].testName,
                                   note: _this.appTestData[n].note,
                                   result1: _this.appTestData[n].result1,
                                   result2: _this.appTestData[n].result2,

                              },{}).then((response) => {
                                    if( m == saveIndex.length) {
                                      arrSelectIndex = [];
                                      arrSelectIndexRet2 = [];
                                      arrSelectIndexSavedRet1  = [];
                                      arrSelectIndexSavedRet2 = [];
                                      _this.pageChange(this.$refs.pager.currentPage );
                                    }
                                    m++;
                              });
                          }
                          j++;
                      });
                  }
              }
          },
          dateFormat(fmt,date)
          {
               var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
              };
              if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
              for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
              return fmt;
          },
          appChange() {
             if(this.appId == "") return;
             this.$http.post('/api/app/getAppTest', {
                   appId: this.appId,
             },{}).then((response) => {
                  arrSelectData = response.body;
                  this.pageTotal = response.body.length;
                  for( let i= 0; i< arrSelectData.length; i++) {
                    arrSelectData[i].no = i+1;
                  }
                 let retData = [];
                 var end =(this.pageSize > this.pageTotal) ? this.pageTotal :this.pageSize;
                 for( let i= 0; i< end; i++) {
                   retData.push(arrSelectData[i]);
                 }
                 this.appTestData = retData;
                 arrSelectIndex = [];
                 arrSelectIndexRet2 = [];
                 arrSelectIndexSavedRet1  = [];
                 arrSelectIndexSavedRet2 = [];
             });

          },
          pageChange(newPage) {
              let retData = [];
            this.$http.post('/api/app/getAppTest', {
              appId: this.appId,
            },{}).then((response) => {
                arrSelectData = response.body;
                this.pageTotal = response.body.length;
                for( let i= 0; i< arrSelectData.length; i++) {
                  arrSelectData[i].no = i+1;
                }
                var start = newPage * this.pageSize - this.pageSize;
                var end = (newPage * this.pageSize > this.pageTotal) ? this.pageTotal :newPage * this.pageSize;
                for( let i= start; i< end; i++) {
                  retData.push(arrSelectData[i]);
                }
                this.appTestData = retData;
                arrSelectIndex = [];
                arrSelectIndexRet2 = [];
                arrSelectIndexSavedRet1  = [];
                arrSelectIndexSavedRet2 = [];
          });

          },
          pageSizeChange(pageSize) {
              this.pageSize = pageSize;
              this.pageChange(this.$refs.pager.currentPage );
          },
          SelectDisabled(value,index) {
              if(arrSelectIndex.indexOf(index) > -1 ) {return false;}
              if(value == null || value == ""){
                arrSelectIndex.push(index);
                return false;
              }else {
                arrSelectIndexSavedRet1.push(index);
                return true;
              }
          },
          SelectDisabledRet2(value,index) {
              if(arrSelectIndexRet2.indexOf(index) > -1 ) {return true;}
              if(value == null || value == ""){
                arrSelectIndexRet2.push(index);
                return true;
              }else {
                arrSelectIndexSavedRet2.push(index);
                return false;
              }
          },
          initAppTestColumns() {
            let _this = this;
            this.appTestColumns = [
                {
                  title: '序号',
                    key: 'no',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '浏览器',
                    key: 'explorer',
                    width: 75,
                     render: (h, params) => {
                         return h('div', {style:{color:'red'}}, 'IE')
                     }
                },
                 {
                    title: '项目名称',
                    key: 'testName',
                    width: 100,
                    className: 'demo-table-info-column',
                 },
                 {
                    title: '类型',
                    key: 'ctrlName',
                    width: 150,
                    className: 'demo-table-info-column',
                 },
                 {
                    title: '测试',
                    key: 'caseInfo',
                    minWidth:200,
                    className: 'table-info-strong',
                 },
                {
                   title: '备注',
                   key: 'note',
                   minWidth:120,
                   maxWidth:200,
                   render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: 'textarea',
                                value:_this.appTestData[params.index].note
                            },
                            style: {
                                marginTop: '5px',
                                marginBottom:'5px',
                            },
                            on:{
                                'on-blur':(event) => {
                                    _this.appTestData[params.index].note = event.target.value;
                                }
                            },
                        })
                   }
                },
                {
                    title: '结果1',
                    key: 'result1',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                            props:{
                                value:_this.appTestData[params.index].result1,
                                disabled: this.SelectDisabled(_this.appTestData[params.index].result1,params.index),
                            },
                            on:{
                                'on-change':(event) => {
                                   _this.appTestData[params.index].result1 = event;
                                }
                            }
                        },
                        [
                            h('Option',{
                              props: {
                                value: ''
                              }
                            },'-'),
                            h('Option',{
                                props: {
                                    value: 'OK'
                                }
                            },'OK'),
                            h('Option',{
                                props: {
                                    value: 'NG'
                                }
                            },'NG'),
                            h('Option',{
                                props: {
                                    value: 'NA'
                                }
                            },'NA')
                        ]
                        );
                    }
                },
                {
                    title: '时间1',
                    key: 'time1',
                    width:165,
                    className: 'table-info-strong',
                    render: function (h, params) {
                      return h('div',
                        _this.appTestData[params.index].time1 == null ? null : _this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(_this.appTestData[params.index].time1))
                       );
                    }
                },
                {
                    title: '结果2',
                    key: 'result2',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                            props:{
                                value: _this.appTestData[params.index].result2,
                                disabled: (_this.appTestData[params.index].result1 == 'NG' && _this.SelectDisabledRet2(_this.appTestData[params.index].result2,params.index)) ? false : true,
                            },
                            on:{
                               'on-change':(event) => {
                                 _this.appTestData[params.index].result2 = event;
                               }
                            }
                        },
                        [
                            h('Option',{
                              props: {
                                value: ''
                              }
                            },'-'),
                            h('Option',{
                                props: {
                                    value: 'OK'
                                }
                            },'OK'),
                            h('Option',{
                                props: {
                                    value: 'NG'
                                }
                            },'NG'),
                            h('Option',{
                                props: {
                                    value: 'NA'
                                }
                            },'NA')
                        ]
                        );
                    }
                },
                {
                    title: '时间2',
                    key: 'time2',
                    width:160,
                    className: 'table-info-strong',
                    render: function (h, params) {
                      return h('div',
                        _this.appTestData[params.index].time2 == null ? null : _this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(_this.appTestData[params.index].time2))
                       );
                    }
                },
            ];

          }
        }
    }
</script>


