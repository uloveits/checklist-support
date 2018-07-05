<template>
  <div id="app">
      <div class="head">
          <Menu mode="horizontal" theme="dark" @on-select="turnUrl" :active-name="active">
              <MenuItem name="1">
                 <Icon type="ios-game-controller-a"></Icon>
                  控件一览
              </MenuItem>
              <MenuItem name="2">
                  <Icon type="ios-game-controller-a-outline"></Icon>
                  控件每case一览
              </MenuItem>
              <MenuItem name="3">
                  <Icon type="ios-game-controller-b"></Icon>
                 App一览
              </MenuItem>
              <MenuItem name="4">
                 <Icon type="ios-game-controller-b-outline"></Icon>
                 App每控件一览
              </MenuItem>
              <MenuItem name="5">
                  <Icon type="ios-book"></Icon>
                 App测试
              </MenuItem>
              <MenuItem name="6">
                  <Icon type="ios-upload"></Icon>
                 Excel导出
              </MenuItem>
          </Menu>
          <br>
      </div>
      <router-view/>
      <Footer class="myFooter">2018-2019 @by一根网线丶</Footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
      turnUrl(name) {
         if(name == "1") {
            this.$router.push({path:'/'});
         }else if(name == "2") {
            this.$router.push('/ctrlCaseList');
         }
         else if(name == "3") {
            this.$router.push('/appList');
         }else if(name == "4") {
            this.$router.push('/appCtrlList');
         }else if(name == "5") {
            this.$router.push('/appTestList');
         }
         else if(name == "6") {
            this.$router.push('/exportExcel');
         }
      }
  },
  data () {
      return {
          active:'1',
      }
  },
   created () {
       var url = window.location.href;
       if (url.endsWith("/ctrlCaseList")) {
          this.active = "2";
       }
       if (url.endsWith("/appList")) {
          this.active = "3";
       }
       if (url.endsWith("/appCtrlList")) {
          this.active = "4";
       }
       if (url.endsWith("/appTestList")) {
          this.active = "5";
       }
       if (url.endsWith("/exportExcel")) {
          this.active = "6";
       }
    },

}
</script>

<style>
html {
    height: 100%;
}
body {
    margin: 0;
    padding: 0 !important;
    height: 100%;
    min-width:790px;
}
label {
    font-size: 15px;
    font-weight: 600;
}
/*.ivu-input{
  border: 1px solid #495060;
}*/
.ivu-table th {
  background: #990000;
  color: #ffffcc;
}
.ivu-select-disabled .ivu-select-selection {
  color: #660033;
  background: #CCCCCC;
}
  /*.ivu-table-wrapper {
    border: 1px solid orange;
    border-right: 0
  }
  .ivu-table-border td, .ivu-table-border th {
    border-bottom: 1px solid orange;
    border-right: 1px solid orange;
  }*/
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f5f7f9;
  height:100%;
  width:100%;
  min-width:790px;
}
.myFooter {
     position: fixed;
     left:calc(50% - 85px);
     bottom:4px;
     padding:0;
}
</style>
