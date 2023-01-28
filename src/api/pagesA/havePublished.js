const { http } = uni.$u

// 获取字典-任务类型
export const orgList = data => http.request({
  url: `/api/leadertask/respTaskType/list`,
  method: 'post',
  data:{}
})

// 获取任务列表
export const taskList = data => http.request({
  url: `/api/leadertask/respTask/listPage`,
  method: 'post',
  data
})
// 任务作废
export const cancelTaskType = id => http.request({
  url: `/api/leadertask/respTask/cancel/${id}`,
  method: 'post',
})

// 任务详情1
export const getInfoTask = id => http.request({
  url: `/api/leadertask/respTask/getInfo/${id}`,
  method: 'get'
})

// 任务详情2
export const respTaskInstance = data => http.request({
  url: `/api/leadertask/respTaskInstance/listPage`,
  method: 'post',
	data
})
// 子任务
export const respTaskList = data => http.request({
  url: `/api/leadertask/respTask/listPage`,
  method: 'post',
	data
})
// 任务督办
export const urgeTask = data => http.request({
  url: `/api/leadertask/urge/add`,
  method: 'post',
	data
})
// 多人任务详情
export const respTaskDetails = id => http.request({
  url: `/api/leadertask/respTaskInstance/getInfo/${id}`,
  method: 'get'
})
// 任务的一生
export const taskLife = data => http.request({
  url: `/api/leadertask/respTaskInstance/taskLife`,
  method: 'post',
	data
})
// 佐证资料
export const getSupportingInformation = data => http.request({
  url: `/api/leadertask/RespCommitRec/supportingInformation`,
  method: 'post',
	data
})
// 根据id批量获取文件详细信息
export const fileInfo = data => http.request({
  url: `/api/sysfile/file_info/listByIds`,
  method: 'post',
	data
})
// 任务详情1
export const getInfoByTaskId = id => http.request({
  url: `/api/leadertask/respTaskInstance/getInfoByTaskId/${id}`,
  method: 'get'
})
