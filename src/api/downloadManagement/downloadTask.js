/**
 * 下载任务
 * @module api/downloadManagement/downloadTask
 */
const { http } = uni.$u

export const downloadLineList = () => http.request({
  url: '/device/lineManage/downloadLineList',
  method: 'GET',
})

export const downloadCheckTaskByLine = data => http.request({
  url: '/device/lineManage/downloadCheckTaskByLine',
  method: 'POST',
  data
})
