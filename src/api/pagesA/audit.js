/**
 * 周期任务
 */
const { http } = uni.$u

/** 查询任务列表 */
export const getauditList = data => http.request({
  url: 'api/leadertask/respTask/checkPage',
  method: 'POST',
  data
})

/** 获取务类型*/
export const getTaskType = data => http.request({
  url: 'api/leadertask/respTaskType/list',
  method: 'POST',
  data
})

/** 获取任务详情*/
export const getInfo = (id) => http.request({
  url: `api/leadertask/respTask/getInfo/${id}`,
  method: 'get',
})

/** 获取务类型*/
export const getRespCommitRec = data => http.request({
  url: '/api/leadertask/RespCommitRec/commitList',
  method: 'POST',
  data
})

/** 新增审核成功记录*/
export const commit = data => http.request({
  url: '/api/leadertask/RespCommitRec/approval',
  method: 'POST',
  data
})


/** 驳回*/
export const reject = data => http.request({
  url: '/api/leadertask/RespCommitRec/reject',
  method: 'POST',
  data
})

//佐证资料
export const getSupportingInformation  = data => http.request({
	url: 'api/leadertask/RespCommitRec/supportingInformation',
	method: 'post',
	data
}) 

/**附件*/
export const fileInfo = data => http.request({
  url: 'api/sysfile/file_info/listByIds',
  method: 'POST',
  data
})

/**系统平分*/
export const getCompleteSpeed = (taskInstanceId) => http.request({
  url: `api/leadertask/RespCommitRec/getCompleteSpeed/${taskInstanceId}`,
  method: 'get',
 
})

// 任务的一生
export const taskLife = data => http.request({
  url: `/api/leadertask/respTaskInstance/taskLife`,
  method: 'post',
	data
})