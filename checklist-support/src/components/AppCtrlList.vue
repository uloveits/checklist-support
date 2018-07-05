<template>
    <Content :style="{background: '#fff', position: 'absolute',top: '80px',bottom: '30px', left: '20px', right:' 20px',overflow:'auto'}">
        <div style="padding:8px;">
            <Row>
                <Col span="24">
                    <div style="display:inline-block;vertical-align: middle;width:75px;">
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
                    <div style="display:inline-block;vertical-align: middle;width:75px;">
                        <label>控件类型:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Select v-model="ctrlId" style="width:200px">
                               <Option v-for="item in ctrlList" :value="item.id" :key="item.ctrlName">{{ item.ctrlName }}</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                    <div style="display:inline-block;vertical-align: middle;width:75px;">
                        <label>控件名称:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="testName" placeholder="请输入您要测试的控件名称..." style="width: 300px;"></Input>
                    </div>
                    <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Button type="primary" @click="addAppCtrl">追加</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="20" style="margin-top:10px;">
                     <Table border :columns="appCtrlColumns" :data="appCtrlData"  ref=table :height="tableHeight" size="small"></Table>
                </Col>
            </Row>
        </div>

    </Content>
</template>

<script>
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

     function getApp(_this){
         _this.$http.post('/api/app/getApp', {},{}).then((response) => {
            if(response.ok) {
                _this.appData = response.body;
            }
          })
     }

     function getAppCtrl(_this) {
         _this.$http.post('/api/app/getAppCtrl', {
               appId: _this.appId,
         },{}).then((response) => {
              console.log(response.body);
             _this.appCtrlData = response.body;
         });
     }
    export default {
        //组建渲染的时候执行
        created () {
          //获得app名Select数据
          this.$http.post('/api/app/getApp', {},{}).then((response) => {
                  if(response.ok) {
                      this.appList = response.body;
                  }
           })
          //获得控件数据
          this.$http.post('/api/ctrl/getCtrl', {},{}).then((response) => {
               this.ctrlList = response.body;
          });
        },
      mounted() {
        // 设置表格高度
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 260
      },
        data () {
            return {
                appId:'',
                appList:[],
                ctrlId:'',
                ctrlList:[],
                testName:'',
                tableHeight:'',
                appCtrlColumns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '控件类型',
                        key: 'ctrlName',
                        width: 400,
                    },
                     {
                        title: '控件名称',
                        key: 'testName',
                     },
                  {
                    title: '功能',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                      return h('div', [
                          h('Button', {
                            props: {
                              type: 'error',
                              size: 'small'
                            },
                            on: {
                              click: () => {

                               }
                            }
                          }, 'Delete')
                        ]);
                      }
                    }
                ],

                appCtrlData:[],
            }
        },

        computed: {
        },
        methods: {
          appChange() {
            getAppCtrl(this);
          },
          addAppCtrl() {
               if(this.appId == "" || this.ctrlId == "" || this.testName == "") {
                  this.$Modal.info({
                      title: "友善的提醒",
                      content: "这三个你都得写点什么，我才让你追加！"
                  });
                  return;
               }
               var id = uuid();
                this.$http.post('/api/app/addAppCtrl', {
                     id: id,
                     appId: this.appId,
                     ctrlId: this.ctrlId,
                     testName: this.testName
                 },{}).then((response) => {
                     if(response.ok) {
                        getAppCtrl(this);
                         this.testName = "";
                     }
                 })
                 //this.$http.post('/api/ctrl/getCtrlCase', {
                        //ctrlId: this.ctrlId,
                 //},{}).then((response) => {
                  //    var ctrlCase = response.body;
                  //    console.log(ctrlCase);
                 //     for(var i= 0;i< ctrlCase.length; i++) {
                  //         var testId = uuid();
                  //         this.$http.post('/api/app/addAppTest', {
                  //              id: testId,
                      //          appId: this.appId,
                  //              ctrlId: this.ctrlId,
                 //               caseId:ctrlCase[i].caseId,
                   //         },{}).then((response) => {
                  //              //doNothing
                  //          })
                   //   }
                 //});

          }
        }
    }
</script>


