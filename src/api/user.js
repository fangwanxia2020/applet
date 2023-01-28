/**
 * 用户
 * @module api/user
 */
const { http } = uni.$u

/** 获取用户信息 */
export const getInfo = () => http.request({
  url: '/system/getInfo',
  method: 'GET'
})

/** 根据用户 id 查用户详细信息 */
export const userByUserId = userId => http.request({
  url: `/system/system/user/${userId}`,
  method: 'GET'
})
