<template>
    <Content :style="{background: '#fff', position: 'absolute',top: '80px',bottom: '30px', left: '20px', right:' 20px',overflow:'auto'}">
        <div style="padding:8px;">
            <Row>
                <Col span="24">
                    <div style="display:inline-block;vertical-align: middle;">
                        <label>控件名:</label>
                    </div>
                     <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Input v-model="ctrlName" placeholder="请输入控件名..." style="width: 300px;"></Input>
                    </div>
                    <div style="display:inline-block;vertical-align: middle;padding-left:8px;">
                        <Button type="primary" @click="addCtrl">追加</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span="20" style="margin-top:10px;">
                     <Table border :columns="controlsColumns" :data="ctrlData" ref=table :height="tableHeight" size="small"></Table>
                </Col>
            </Row>
        </div>
    </Content>
</template>

<script>
    function GetCtrl(_this) {
         _this.$http.post('/api/ctrl/getCtrl', {},{}).then((response) => {
                _this.ctrlData = response.body;
         })
    }
    export default {
        //组建渲染的时候执行
        created () {
           this.$http.post('/api/ctrl/getCtrl', {},{}).then((response) => {
                this.ctrlData = response.body;
            })
        },
        mounted() {
          // 设置表格高度
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 180
        },
        data () {
            return {
                ctrlName:'',
                tableHeight:'',
                controlsColumns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '控件名',
                        key: 'ctrlName'
                    },
                ],

                ctrlData:[],
            }
        },

        computed: {

        },
        methods: {
            //添加控件
            addCtrl() {
                if(this.ctrlName == "") {
                    this.$Modal.info({
                        title: "友善的提醒",
                        content: "控件名不能为空！"
                    });
                    return;
                }
                this.$http.post('/api/ctrl/addCtrl', {
                    ctrlName: this.ctrlName,
                },{}).then((response) => {
                    if(response.ok) {
                        GetCtrl(this);
                        this.ctrlName = "";
                    }
                })
            }
        }
    }
</script>
