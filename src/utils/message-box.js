/**
 * 提示框模块
 * @module message-box
 */
import Vue from 'vue'
import UModal from 'uview-ui/components/u-modal/u-modal'

/**
 * 提示框基础函数
 * @param {Object} toastOpt 提示参数
 */
const toastBase = toastOpt => {
  toastOpt.duration = typeof toastOpt.duration === 'number' ? toastOpt.duration : 3000
  toastOpt.mask = toastOpt.mask === undefined || toastOpt.mask === true ? true : false
  uni.showToast({
    title: '提示',
    icon: 'none',
    duration: 3000,
    mask: true,
    ...toastOpt
  })
}

/**
 * 普通提示
 * @param {string} title 提示的内容
 * @param {number} [duration] 提示的延迟时间,单位毫秒, 默认:3000
 * @param {boolean} [mask] 是否显示透明蒙层,防止触摸穿透, 默认:true
 * @returns {Promise}
 * @example <caption>使用例子</caption>
 * this.toast('欢迎你!')
 */
export const toast = (title, duration = 3000, mask = true) => {
  toastBase({
    title,
    duration,
    mask
  })
  return new Promise(rv => {
    setTimeout(rv, duration)
  })
}

/**
 * 成功提示，可以在提示消失后再做操作
 * @param {string} title 提示的内容
 * @param {number} [duration] 提示的延迟时间,单位毫秒, 默认:3000
 * @param {boolean} [mask] 是否显示透明蒙层,防止触摸穿透, 默认:true
 * @returns {Promise}
 * @example <caption>使用例子</caption>
 * this.toastSuccess('添加成功!')
 * @example <caption>提示框消失之后再操作</caption>
 * this.toastSuccess('添加成功!').then(() => {
 *   // 做操作
 * })
 * // 或者
 * async function asyncFn() {
 *   await this.toastSuccess('添加成功!')
 *   // 做操作
 * }
 */
export const toastSuccess = (title, duration = 3000, mask = true) => {
  toastBase({
    title,
    icon: 'success',
    duration,
    mask
  })
  return new Promise(rv => {
    setTimeout(rv, duration)
  })
}

/**
 * 自定义提示
 * @param {string} title 提示的内容
 * @param {string} image 自定义图标的本地路径
 * @param {number} [duration] 提示的延迟时间,单位毫秒, 默认:3000
 * @param {boolean} [mask] 是否显示透明蒙层,防止触摸穿透, 默认:true
 * @example <caption>使用例子</caption>
 * this.toastCustomize('自定义提示', imageUrl)
 */
export const toastCustomize = (title, image, duration = 3000, mask = true) => {
  toastBase({
    title,
    duration,
    mask,
    image
  })
  return new Promise(rv => {
    setTimeout(rv, duration)
  })
}

/**
 * 函数形式调用 u-modal 组件，APP-PLUS 不支持 document
 * @param {Object} props 组件属性，继承自 {@link https://www.uviewui.com/components/modal.html#props u-modal 组件属性}
 * @param {Object} [props.scopedSlots] 组件插槽，继承自 {@link https://www.uviewui.com/components/modal.html#slots u-modal 组件属性}
 * @param {Function} [props.confirm] confirm 事件回调
 * @param {Function} [props.close] close 事件回调
 * @param {Function} [props.cancel] cancel 事件回调
 */
export const uModalBox = props => {
  const { scopedSlots = {} } = props
  const vue = new Vue({
    data() {
      return {
        show: true
      }
    },
    methods: {
      /**
       * 关闭模态框
       * @param {string} [cbKey] 回调函数属性名
       */
      handleModalHide(cbKey) {
        const cb = props[cbKey]
        if (this.$type.fun(cb)) {
          cb()
        }
        this.show = false
        setTimeout(() => document.body.removeChild(el), 300)
      }
    },
    render() {
      const { confirmButton } = scopedSlots
      const confirmButtonCom = () => this.$type.fun(confirmButton)
        ? <template slot="confirmButton">{confirmButton()}</template>
        : null
      return <UModal
        show={this.show}
        showCancelButton
        scopedSlots={scopedSlots}
        attrs={props}
        onConfirm={() => this.handleModalHide('confirm')}
        onClose={() => this.handleModalHide('close')}
        onCancel={() => this.handleModalHide('cancel')}
      >
        {confirmButtonCom()}
      </UModal>
    }
  })
  const el = vue.$mount().$el

  document.body.appendChild(el)
}
