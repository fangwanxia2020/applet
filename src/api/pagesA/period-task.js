/**
 * 周期任务
 */
const { http } = uni.$u

/** 查询周期任务列表 */
export const getTaskList = data => http.request({
  url: 'api/leadertask/RespPeriodicTask/listPage',
  method: 'POST',
  data
})

/** 获取任务类型*/
export const getTaskType = data => http.request({
  url: 'api/leadertask/respTaskType/list',
  method: 'POST',
  data
})

/** 修改启用状态*/
export const changeEnable = data => http.request({
  url: 'api/leadertask/respPeriodicTask/changeEnable',
  method: 'POST',
  data
})

/** 关注/取消关注周期任务*/
export const attention = data => http.request({
  url: 'api/leadertask/attention/setAttention',
  method: 'POST',
  data
})

/** 关注/取消关注周期个人任务*/
export const addAndCancel = data => http.request({
  url: 'api/leadertask/respTaskPsnAttention/addAndCancel',
  method: 'POST',
  data
})

/**查询任务列表*/
export const respTask = data => http.request({
  url: 'api/leadertask/respTask/listPage',
  method: 'POST',
  data
})

/**查询任务实例列表*/
export const respTaskInstance = data => http.request({
  url: 'api/leadertask/respTaskInstance/listPage',
  method: 'POST',
  data
})

/**查询任务实例列表*/
export const add = data => http.request({
  url: 'api/leadertask/respPeriodicTask/add',
  method: 'POST',
  data
})

/**查询任务详情*/
export const getInfo = (id) => http.request({
  url: `api/leadertask/respPeriodicTask/getInfo/${id}`,
  method: 'POST',
})

/**历史记录*/
export const commitList = data => http.request({
  url: 'api/leadertask/RespCommitRec/commitList',
  method: 'POST',
  data
})

/**附件*/
export const fileInfo = data => http.request({
  url: 'api/sysfile/file_info/listByIds',
  method: 'POST',
  data
})

//佐证资料
export const getSupportingInformation  = data => http.request({
	url: 'api/leadertask/RespCommitRec/supportingInformation',
	method: 'post',
	data
}) 



/**系统平分*/
export const getCompleteSpeed = (taskInstanceId) => http.request({
  url: `api/leadertask/RespCommitRec/getCompleteSpeed/${taskInstanceId}`,
  method: 'get',
 
})

export const getRespCommitRec = data => http.request({
  url: '/api/leadertask/RespCommitRec/commitList',
  method: 'POST',
  data
})

/**查询任务详情*/
export const getInfoP = (id) => http.request({
  url: `api/leadertask/respTaskInstance/getInfo/${id}`,
  method: 'GET',
})

/**查询任务详情*/
export const urgeTask = data => http.request({
  url: `api/leadertask/urge/add`,
  method: 'POST',
  data
})

// 获取任务下发次数
export const getTaskCount = data => http.request({
  url: `api/leadertask/respPeriodicTask/taskCount`,
  method: 'POST',
  data
})

// 获取任务下发次数
export const taskLife = data => http.request({
  url:'api/leadertask/respTaskInstance/taskLife',
  method: 'POST',
  data
})