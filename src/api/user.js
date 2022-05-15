import request from '@/utils/request'

export const login = params => {
  return request({
    url: '/user/login',
    method: 'post',
    params,
    baseURL: 'http://localhost:8866', // 直接通过覆盖的方式
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [data => {
    // 对 data 进行任意转换处理
      return JSON.stringify(data)
    }]
  })
}
// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'post',
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
    // params: { token }
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
// custom
export function findAllUser() {
  return request({
    url: '/user/findAllUser',
    method: 'post',
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
export function updateUser(params) {
  return request({
    url: '/user/updateUserProfile',
    method: 'patch',
    params,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
export function updateUserPassword(params) {
  return request({
    url: '/user/forget',
    method: 'post',
    params,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
