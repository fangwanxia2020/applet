const { http } = uni.$u

// 组织列表
export const sys_org = () => http.request({
  url: `api/system/sys_org/list`,
  method: 'post'
})

// 任务完成情况
export const getTaskOverview = data => http.request({
  url: `api/leadertask/StatisticalAnalysis/getTaskCompleteSituation`,
  method: 'post',
	data
})
