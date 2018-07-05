<template>
    <Content :style="{background: '#fff', position: 'absolute',top: '80px',bottom: '30px', left: '20px', right:' 20px',overflow:'auto'}">
        <div style="padding:8px;">
            <Row>
                <Col span="24">
                    <div style="display:inline-block;vertical-align: middle;width:50px;">
                        <label>App名:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="appName" placeholder="请输入您要添加的App名..." style="width: 300px;"></Input>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                    <div style="display:inline-block;vertical-align: middle;width:50px;">
                        <label>实施者:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="appUserName" placeholder="请输入实施者的名字..." style="width: 300px;"></Input>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                    <div style="display:inline-block;vertical-align: middle;width:50px;">
                        <label>版本:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="appVersion" placeholder="请输入App的版本号..." style="width: 300px;"></Input>
                    </div>
                    <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Button type="primary" @click="addApp">追加</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="20" style="margin-top:10px;">
                     <Table border :columns="appColumns" :data="appData" ref=table :height="tableHeight" size="small"></Table>
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
    export default {
        //组建渲染的时候执行
        created () {
          getApp(this);
        },
        mounted() {
          // 设置表格高度
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 260
        },
        data () {
            return {
                appName:'',
                appUserName:'',
                appVersion:'',
                tableHeight:'',
                appColumns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'App名',
                        key: 'appName',
                        width: 400,
                    },
                     {
                        title: '实施者',
                        key: 'appUser',
                        width: 200,
                     },
                     {
                        title: '版本',
                        key: 'version',
                        width: 200,
                     },
                     {
                        title: 'App进度',
                        key: 'appSchedule',
                        render: (h, params) => {
                            return h('div', {style:{color:'red'}}, '待开发..')
                        }
                     },
                ],

                appData:[],
            }
        },

        computed: {
        },
        methods: {
          addApp() {
               if(this.appName == "" || this.appUserName == "" || this.appVersion == "") {
                  this.$Modal.info({
                      title: "友善的提醒",
                      content: "这三个你都得写点什么，我才让你追加！"
                  });
                  return;
               }
               var appId = uuid();

               this.$http.post('/api/app/addApp', {
                    appId: appId,
                    appName: this.appName,
                    appUser: this.appUserName,
                    version: this.appVersion
                },{}).then((response) => {
                    if(response.ok) {
                        getApp(this);
                        this.appName = "";
                        this.appUserName = "";
                        this.appVersion = "";
                    }
                })
          }
        }
    }
</script>

