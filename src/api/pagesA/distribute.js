const { http } = uni.$u

// 获取字典-任务类型
export const getList = data => http.request({
  url: `/api/leadertask/StatisticalAnalysis/getTaskAssignmentSituation`,
  method: 'post',
  data
})

// 组织ID
export const getOrg = data => http.request({
  url: `/api/system/sys_org/list`,
  method: 'post',
  data
})