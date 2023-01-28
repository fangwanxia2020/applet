const { http } = uni.$u

export const myInfo = id => http.request({
  url: `/api/system/sys_person/get/${id}`,
  method: 'get',
})


export const profile =()=> http.request({
  url: '/auth/user/profile',
  method: 'get',
})