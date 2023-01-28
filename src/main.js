import Vue from 'vue'
import uView from 'uview-ui'
import utils from './utils'
import http from './api/http'
import store from './store'
import App from './App'
import moment from 'moment';

//时间转换工具
import toDateUtil from '@/utils/date.js';
Vue.prototype.toDateUtil = toDateUtil;

App.mpType = 'app'

Vue.config.productionTip = false
Vue.prototype.moment = moment;
Vue.prototype.userId = ''

Vue.use(uView)
Vue.use(utils)  // 项目公共方法插件
Vue.use(http)  // 项目请求配置


const app = new Vue({
  store,
  ...App
})

app.$mount()
