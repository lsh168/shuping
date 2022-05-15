import request from '@/utils/request'

export function getPageBooks(data) {
  return request({
    url: '/admin/pagebooks',
    method: 'post',
    params: data,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}

export function bookCategory(query) {
  return request({
    url: '/book/categoryList',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}

export function updateBook(query) {
  return request({
    url: '/admin/update',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}

export function createBook(query) {
  return request({
    url: '/admin/create',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
// 假删除
export function deleteBook(query) {
  return request({
    url: '/admin/delete',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
// 查询删除的图书
export function selectDeletedBook(query) {
  return request({
    url: '/admin/selectDeleted',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
// 恢复删除的图书
export function updateDeletedBook(query) {
  return request({
    url: '/admin/updateDeleted',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
