const { http } = uni.$u

// 人员进度显示
export const getTask = data => http.request({
   url: `api/leadertask/respTask/listPsnScheduleInspection`,
    method: 'post',
    data
})

// 人员进度数 
export const getCount = type => http.request({
   url: `api/leadertask/respTask/getScheduleCount/${type}`,
     method: 'get',
})
