const { http } = uni.$u

// 组织列表
export const sys_org = () => http.request({
  url: `api/system/sys_org/list`,
  method: 'post'
})

// 任务情况总览
export const getTaskOverview = data => http.request({
  url: `api/leadertask/StatisticalAnalysis/getTaskOverview`,
  method: 'post',
	data
})
