const { http } = uni.$u

// 任务进度显示
export const getTask = data => http.request({
  url: `api/leadertask/respTask/listTaskScheduleInspection`,
  method: 'post',
	data
})
// 任务进度数
export const getCount = type => http.request({
  url: `api/leadertask/respTask/getScheduleCount/${type}`,
  method: 'get'
})
