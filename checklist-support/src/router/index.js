import Vue from 'vue'
import Router from 'vue-router'
import ControlsList from '../components/ControlsList'
import CtrlCaseList from '../components/CtrlCaseList'
import AppList from '../components/AppList'
import AppCtrlList from '../components/AppCtrlList'
import AppTestList from '../components/AppTestList'
import ExportExcel from '../components/ExportExcel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: ControlsList
    },
    {
      path: '/ctrlCaseList',
      component: CtrlCaseList
    },
    {
      path: '/appList',
      component: AppList
    },
    {
      path: '/appCtrlList',
      component: AppCtrlList
    },
    {
      path: '/appTestList',
      component: AppTestList
    },
    {
      path: '/exportExcel',
      component: ExportExcel
    },
  ]
})
