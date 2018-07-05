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
                         <Button type="primary" shape="circle" icon="social-html5" @click="exportExcel">导出Excel</Button>
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                     <Table border :columns="exportColumns" :data="exportData" ref=table :height="tableHeight" size="small"></Table>
                </Col>
            </Row>
        </div>

    </Content>
</template>

<script>

    export default {
        //组建渲染的时候执行
        created () {
          //获得app名Select数据
          this.$http.post('/api/app/getApp', {},{}).then((response) => {
                  if(response.ok) {
                      this.appList = response.body;
                      console.log(this.appList);
                  }
           });
            //exportColumns
             this.initExportColumns();
        },
        mounted() {
          // 设置表格高度
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 220
        },
        data () {
            return {
                appId:[],
                appList:[],
                exportData:[],
                exportColumns:[],
                tableHeight:450,

            }
        },
        methods: {
          formatJson(filterVal, jsonData) {
          　　　return jsonData.map(v => filterVal.map(j => v[j]))
          },
          exportExcel() {
             const _this = this;
             require.ensure([], () => {
                  const { export_json_to_excel } = require('../vendor/Export2Excel');
                  const tHeader = ['No', 'ブラウザ', '項目名','実施内容/目的','備考','Ver','初回実施日','初回実施者', '初回結果','最終実施日','最終実施者', '最終結果'];
                  const filterVal = ['no', 'explorer', 'testName', 'caseInfo','note', 'version', 'time1', 'testUser1', 'result1', 'time2', 'testUser2', 'result2'];
                  const list = _this.exportData;
            　　　const data = _this.formatJson(filterVal, list);
            　　　export_json_to_excel(tHeader, data, _this.exportData[0].appName + '-checklist');
             })
          },
          appChange() {
             if(this.appId == "") return;
             this.$http.post('/api/app/getAppTestExport', {
                   appId: this.appId,
             },{}).then((response) => {
                 var retData = response.body;
                 for(var i= 0; i< retData.length;i++) {
                       if(retData[i].result1 == "NA" ){
                        retData.splice(i, 1)
                      }
                 }
                 for(var i= 0;i< retData.length; i++) {
                    retData[i].no = i+1;
                    retData[i].testUser1 = (retData[i].result1 == null) ? null : retData[i].appUser;
                    retData[i].testUser2 = (retData[i].result2 == null) ? null : retData[i].appUser;
                    retData[i].time1 = (retData[i].time1 == null) ? null : this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(retData[i].time1));
                    retData[i].time2 = (retData[i].time2 == null) ? null : this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(retData[i].time2));

                 }
                 this.exportData = retData;
                 console.log(this.exportData);
             });

          },
          initExportColumns() {
              let _this = this;
              this.exportColumns = [
              {
                  type: 'index',
                  width: 60,
                  align: 'center'
              },
              {
                  title: 'ブラウザ',
                  key: 'explorer',
                  width: 90,
              },
               {
                  title: '項目名',
                  key: 'testName',
                  width: 200,
               },
               {
                  title: '実施内容/目的',
                  key: 'caseInfo',
                  width: 400,
               },
               {
                   title: '備考',
                   key: 'note',

               },
               {
                   title: 'Ver',
                   key: 'version',

               },
               {
                  title: '初回実施日',
                  key: 'time1',
                  width:170,
                  align: 'center',
               },
               {
                  title: '初回実施者',
                  key: 'testUser1',
                  align: 'center',
               },
               {
                  title: '初回結果',
                  key: 'result1',
                  width: 90,
                  align: 'center',
               },
               {
                   title: '最終実施日',
                   key: 'time2',
                   width:170,
                   align: 'center',
               },
               {
                   title: '最終実施者',
                   key: 'testUser2',
                   align: 'center',
               },
               {
                   title: '最終結果',
                   key: 'result2',
                   width:90,
                   align: 'center',
               },
              ];
          },
          dateFormat(fmt,date) {
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
        }
    }
</script>


