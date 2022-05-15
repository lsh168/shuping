import request from '@/utils/request'

export function selectEvaluationState() {
  return request({
    url: '/adminEvaluation/selectState',
    method: 'post',
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}

export function updateState(query) {
  return request({
    url: '/adminEvaluation/update',
    method: 'post',
    params: query,
    baseURL: 'http://localhost:8866' // 直接通过覆盖的方式
  })
}
