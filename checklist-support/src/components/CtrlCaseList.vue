<template>
    <Content :style="{background: '#fff', position: 'absolute',top: '80px',bottom: '30px', left: '20px', right:' 20px',overflow:'auto'}">
        <div style="padding:8px;">
            <Row>
                <Col span="24">
                    <div style="display:inline-block;vertical-align: middle;width:71px;">
                        <label>控件选择:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                         <Select v-model="ctrlId" @on-change="ctrlChange" style="width:200px">
                                 <Option v-for="item in ctrlList" :value="item.id" :key="item.ctrlName">{{ item.ctrlName }}</Option>
                         </Select>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin-top:10px;">
                    <div style="display:inline-block;vertical-align: middle;">
                        <label>Case添加:</label>
                    </div>
                    <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="caseInfo" placeholder="请输入您要添加的Case..." style="width: 300px;"></Input>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                         <Button type="primary" @click="addCtrlCase">添加</Button>
                     </div>
                </Col>
            </Row>
            <Row>
                <Col span="20" style="margin-top:10px;">
                     <Table border :columns="ctrlCaseColumns" :data="ctrlCaseData" ref=table :height="tableHeight" size="small"></Table>
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
     //获得控件的case数据
     function getCtrlCase(_this) {
         _this.$http.post('/api/ctrl/getCtrlCase', {
               ctrlId: _this.ctrlId,
         },{}).then((response) => {
         console.log(response.body);
             _this.ctrlCaseData = response.body;
         });
     }

    export default {
      //组建渲染的时候执行
      created () {
        //获得控件数据
         this.$http.post('/api/ctrl/getCtrl', {},{}).then((response) => {
              this.ctrlList = response.body;
         });
         if(this.ctrlId == "")return;
         //获得控件的case数据
          getCtrlCase(this);
      },
      mounted() {
        // 设置表格高度
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 220
      },
      data () {
          return {
              ctrlId: '',
              caseInfo:'',
              ctrlList:[],
              tableHeight:'',
              ctrlCaseColumns: [
                  {
                      type: 'index',
                      width: 60,
                      align: 'center'
                  },
                  {
                      title: '控件的Case名',
                      key: 'caseInfo'
                  },
              ],
              ctrlCaseData:[],
          }
      },
      methods: {
          //添加Case
          ctrlChange (){
             //获得控件的case数据
               getCtrlCase(this);
          },
          addCtrlCase() {
              if(this.ctrlId == "") {
                  this.$Modal.info({
                      title: "友善的提醒",
                      content: "请选择您要添加case的控件！"
                  });
                  return;
              }
             if(this.caseInfo == "" ) {
                this.$Modal.info({
                    title: "友善的提醒",
                    content: "至少写点什么吧！"
                });
                return;
             }
            var caseId = uuid();

            this.$http.post('/api/ctrl/addCtrlCase', {
                 caseId: caseId,
                 ctrlId: this.ctrlId,
                 caseInfo: this.caseInfo,
             },{}).then((response) => {
                 if(response.ok) {
                     getCtrlCase(this);
                     this.caseInfo = "";
                 }
             })
          }
      }
    }
</script>
