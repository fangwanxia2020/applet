/**
 * 已完成
 */
const { http } = uni.$u

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

// 任务的一生
export const taskLife = data => http.request({
  url: `/api/leadertask/respTaskInstance/taskLife`,
  method: 'post',
	data
})


//下载
// export function getDownload (data) {
//   return selt.request({
//     url: '/api/sysfile/file_info/download',
//     method: 'get',
//     params: data
//   })
// }

// //通用任务夹
// export function getListByAccess (data) {
//   return selt.request({
//     url: '/api/leadertask/folder/listByAccess',
//     method: 'post',
//     data
//   })
// }
// //获取文件
// export function getFileInfo (id) {
//   return selt.request({
//     url: `/api/sysfile/file_info/get/${id}`,
//     method: 'get',
//   })
// }