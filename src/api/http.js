/**
 * 项目统一基于 uview2.0 请求封装，封装为 Vue 插件
 * @module api/http
 * @see {@link https://www.uviewui.com/js/http.html Http请求}
 */

let isGoingToLoginPage = false  // 是否正在导航到登录页
let loadingCount = 0  // 加载提示框的数量

const showLoading = () => {
  if (!loadingCount) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  loadingCount++
}

const hideLoading = (code, msg) => {
  if (loadingCount > 0) {
    loadingCount = code > 200 ? 0 : --loadingCount  // 如果不是 200 的话直接重置 loadingCount
  }
  // 由于 uni.showToast 也会导致加载提示框隐藏，所以必须把 showToast 也考虑进来
  // showToast 相当于报错提示必须要返回
  if (code == 401) {
    if (isGoingToLoginPage) return
    uni.showToast({
      icon: 'none',
      title: '请重新登录！',
      duration: 2000,
      mask: true,
      success() {
				uni.removeStorageSync(TOKEN_KEY)
				uni.removeStorageSync("USER_ID")
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/login/index' })
          isGoingToLoginPage = false
        }, 2000)
      }
    })
    return
  } else if (code > 200) {
    uni.showToast({
      icon: 'none',
      title: msg || '请求异常！',
      mask: true,
      duration: 2000
    })
    return
  }

  if (!loadingCount) {
    uni.hideLoading()
  }
}

const errHandler = err => {
  hideLoading(err.data.code,err.data.msg)
  return Promise.reject(err)
}

/**
 * 项目统一的 localStorage token 属性名
 * @type {string}
 */
export const TOKEN_KEY = 'token'

/**
 * 请求插件
 * @param {import('vue').VueConstructor} Vue Vue 实例
 * @param {Object} [options] 可选的选项对象，可以传任何参数属性进去
 * @param {string} [options.tokenKey] 保存到 localStorage 的 token 属性名
 */
const install = (Vue, options = {}) => {
  const { http } = uni.$u
  const interceptors = http.interceptors
  const { tokenKey = TOKEN_KEY } = options

  /** 请求配置 */
  http.setConfig(config => {
    config.baseURL = process.env.VUE_APP_BASE_API
    config.timeout = 10000
    return config
  })

  /** 请求拦截 */
  interceptors.request.use(config => {
       const token = uni.getStorageSync(tokenKey)
    if (token) {
      config.header.Authorization = token  // 后端 token 请求头
    }
    showLoading()
    return config
  }, errHandler)

  /** 响应拦截 */
  interceptors.response.use(res => {
    const resData = res.data
    let { code, msg } = resData
		if(undefined || 200)  code = '200'
    switch (code) {
      case '200':
        hideLoading()
        return resData
      case '401':
        hideLoading(code)
        if (isGoingToLoginPage) break
        uni.removeStorageSync(tokenKey)
        isGoingToLoginPage = true
        break
      default:
        hideLoading(code, msg)
    }
    return Promise.reject(resData)
  }, errHandler)
}

export default install