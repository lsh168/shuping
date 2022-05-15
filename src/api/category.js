import request from '@/utils/request'

export function addCategory(query) {
  return request({
    url: '/adminCategory/add',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
