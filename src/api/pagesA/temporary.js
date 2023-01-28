const { http } = uni.$u

// 组织列表
export const sys_org = () => http.request({
  url: `api/system/sys_org/list`,
  method: 'post'
})

// 逾期任务
export const listComingToEndTask = data => http.request({
  url: `api/leadertask/respTask/listComingToEndTask`,
  method: 'post',
	data
})

/** 查询任务列表 */
export const getTask = data => http.request({
  url: 'api/leadertask/respTask/checkPage',
  method: 'POST',
  data
})

/** 获取 任务类型*/
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