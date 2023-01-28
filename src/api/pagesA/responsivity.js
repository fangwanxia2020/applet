const { http } = uni.$u

// 积极度分析页面
export const getList = data => http.request({
  url: `/api/leadertask/StatisticalAnalysis/getResponsivityLeaderboard`,
  method: 'post',
  data
})

// 组织ID
export const getOrg = data => http.request({
  url: `/api/system/sys_org/list`,
  method: 'post',
  data
})

