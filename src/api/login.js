/**
 * 登录
 * @module api/login
 */
const { http } = uni.$u

/**
 * 账号密码登录
 * @param {Object} data 请求路径参数选项
 * @param {string} data.username 用户名
 * @param {string} data.password md5 加密后的密码
 * @returns {Promise}
 */
export const login = data => http.request({
  url: '/system/loginOut',
  method: 'POST',
  data
})
/**
 * 登录页查询组织列表
 * @param {Object} data 请求路径参数选项
 * @param {string} data.tenantCode 租户码
 * @returns {Promise}
 */
export const orgList = data => http.request({
  url: '/system/system/org/list',
  method: 'GET',
  data
})
export function oauthToken (data){
  const {grant_type,client_id,client_secret,password,username}=data
  return http.request({
    url: `auth/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}`,
    method: 'post',
  })
}  
export const getInfo = () => http.request({
  url: '/auth/user/profile',
  method: 'GET'
})