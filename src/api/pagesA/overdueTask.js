const { http } = uni.$u

// 组织列表
export const sys_org = () => http.request({
  url: `api/system/sys_org/list`,
  method: 'post'
})

// 逾期任务
export const listOverdueTask = data => http.request({
  url: `api/leadertask/respTask/listOverdueTask`,
  method: 'post',
	data
})
