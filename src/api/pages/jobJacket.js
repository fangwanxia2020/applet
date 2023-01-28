const { http } = uni.$u

// 获取字典-任务类型
export const listByType = () => http.request({
  url: `/api/leadertask/folder/listByType`,
  method: 'get',
})

// 文件夹上移下移
export const moveFolder = (data) => http.request({
  url: `/api/leadertask/folder/moveFolder`,
  method: 'post',
	data
})

// 文件夹数据列表
export const listPageByFolder = (data) => http.request({
  url: `/api/leadertask/respTask/listPageByFolder`,
  method: 'post',
	data
})
// 删除文件夹
export const removeFolder = (id) => http.request({
  url: `/api/leadertask/folder/remove/${id}`,
  method: 'DELETE'
})
// 修改文件夹
export const editFolder = (data) => http.request({
  url: `/api/leadertask/folder/edit`,
  method: 'post',
  data
})
// 添加文件夹
export const addFolder = (data) => http.request({
  url: `/api/leadertask/folder/add`,
  method: 'post',
  data
})
// 添加分解任务
export const breakTask = (data) => http.request({
  url: `/api/leadertask/respTask/breakTask`,
  method: 'post',
  data
})
// 提交/撤回 任务
export const respCommitRec = (data) => http.request({
  url: `/api/leadertask/RespCommitRec/add`,
  method: 'post',
  data
})
// 任务进度更新
export const updateProgress = (data) => http.request({
  url: `/api/leadertask/RespCommitRec/updateProgress`,
  method: 'post',
  data
})

// 添加或取消关注
export const addAndCancel = (data) => http.request({
  url: `/api/leadertask/respTaskPsnAttention/addAndCancel`,
  method: 'post',
  data
})
// 转移文件
export const transferTask = (data) => http.request({
  url: `/api/leadertask/folder/transferTask`,
  method: 'post',
  data
})
// 作废任务
export const cancelTaskType = (id) => http.request({
  url: `/api/leadertask/respTask/cancel/${id}`,
  method: 'post'
})
// 获取进度值
export const getTaskProgress = (taskId,personId) => http.request({
  url: `/api/leadertask/respTaskInstance/getTaskProgress/${taskId}${personId?'?personId='+personId : ''}`,
  method: 'get'
})
// 子任务获负责人
export const getTaskPersonName = (taskId,personId) => http.request({
  url: `/api/leadertask/respTaskInstance/getTaskPersonName/${taskId}${personId?'?personId='+personId : ''}`,
  method: 'get'
})
