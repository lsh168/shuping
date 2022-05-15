import request from '@/utils/request'

export const selectMemberAll = params => {
  return request({
    url: '/memberAdmin/findAll',
    method: 'post',
    params,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  //   transformRequest: [data => {
  //   // 对 data 进行任意转换处理
  //     return JSON.stringify(data)
  //   }]
  })
}

export const updateStatus = params => {
  return request({
    url: '/member/updateStatus',
    method: 'post',
    params,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
