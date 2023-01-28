/**
 * 项目的公共方法统一封装成 Vue 插件，挂载到 Vue 原型上
 * @module utils
 */
import {
  toast,
  toastSuccess,
  toastCustomize,
} from './message-box'
import { test, type } from './verification'

/**
 * 公共方法插件安装函数
 * @param {import('vue').VueConstructor} Vue Vue 构造器
 */
const install = Vue => {
  Object.assign(Vue.prototype, {
    $toast: toast,
    $toastSuccess: toastSuccess,
    $toastCustomize: toastCustomize,
    $test: test,
    $type: type
  })
}

export default install
