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

// 获取通用任务夹列表
export const getListByAccess = data => http.request({
  url: `/api/leadertask/folder/listByAccess`,
  method: 'post',
  data
})
// 获取负责人审核人列表
export const getAndExpr = data => http.request({
  url: `/api/system/sys_person/pageByDeptIdsAndExpr`,
  method: 'post',
  data
})
// 获取负责人审核人列表
export const addTask = data => http.request({
  url: `/api/leadertask/respTask/add`,
  method: 'post',
  data
})
// 发布任务
export const issueRespTask = id => http.request({
  url: `/api/leadertask/respTask/release/${id}`,
  method: 'post'
})
// 删除任务
export const removeRespTask = id => http.request({
  url: `/api/leadertask/respTask/removeRespTask/${id}`,
  method: 'post'
})
// 任务详情1
export const getInfoTask = id => http.request({
  url: `/api/leadertask/respTask/getInfo/${id}`,
  method: 'get'
})

//修改任务
export const editTaskType = data => http.request({
  url: `/api/leadertask/respTask/edit`,
  method: 'post',
  data
})
//创建-发布任务
export const appletsRelease = data => http.request({
  url: `/api/leadertask/respTask/appletsRelease`,
  method: 'post',
  data
})
//修改-发布任务
export const appletsEdit = data => http.request({
  url: `/api/leadertask/respTask/appletsEdit`,
  method: 'post',
  data
})
//根据id批量获取文件详细信息
export const listByIds = data => http.request({
  url: `/api/sysfile/file_info/listByIds`,
  method: 'post',
  data
})
