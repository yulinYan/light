import {
  getAjax as $gAjax,
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 图片切换
export const confAreaPic = (formData) => {
  return $http(`${url}lightAllConf/modify/conf_area_pic`, 'post', 'multipart/form-data', formData)
}
// 添加table
export const confArea = (formData) => {
  return $http(`${url}lightAllConf/save/conf_area`, 'post', 'multipart/form-data', formData)
}
// 获取区域
export const areaList = (deviceType) => {
  return $gAjax(`${url}lightAllConf/find/area_list?deviceType=${deviceType}&time=${Math.random()*100}`)
}
// 获取区域
export const areaConf = (deviceType) => {
  return $gAjax(`${url}lightAllConf/find/area_conf?deviceType=${deviceType}&time=${Math.random()*100}`)
}
// 删除区域
export const removeconfArea = (areaName, deviceType) => {
  return $gAjax(`${url}lightAllConf/remove/confArea?areaName=${areaName}&deviceType=${deviceType}&time=${Math.random()*100}`)
}
