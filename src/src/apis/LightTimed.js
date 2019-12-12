import {
  getAjax as $gAjax,
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 查看执行结果
export const listScheduleExecuteResult = (pageNum, pageSize, lightScheduleId) => {
  return $gAjax(`${url}schedule/listScheduleExecuteResult?pageNum=${pageNum}&pageSize=${pageSize}&lightScheduleId=${lightScheduleId}&time=${Math.random()*100}`)
}
// 获取所有分组
export const findLightCategory = (zoneId) => {
  return $gAjax(`${url}/lightCtrl/ctrl/findLightCategory/${zoneId}?time=${Math.random()*100}`)
}
// 定时
export const listLightSchedule = (pageNum, pageSize) => {
  return $gAjax(`${url}schedule/listLightSchedule?pageNum=${pageNum}&pageSize=${pageSize}&time=${Math.random()*100}`)
}
// 删除
export const removeLightSchedule = (id) => {
  return $gAjax(`${url}schedule/removeLightSchedule/${id}?time=${Math.random()*100}`)
}
// 快捷启用
export const enabled = (id, state) => {
  return $gAjax(`${url}schedule/enabled?id=${id}&state=${state}&time=${Math.random()*100}`)
}
// 保存定时
export const saveLightSchedule = (formData) => {
  return $http(`${url}schedule/saveLightSchedule`, 'post', 'multipart/form-data', formData)
}
// 修改定时
export const updateLightSchedule = (formData) => {
  return $http(`${url}schedule/updateLightSchedule`, 'put', 'multipart/form-data', formData)
}
