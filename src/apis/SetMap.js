import {
  getAjax as $gAjax,
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'
let url = ipNormal;
// 保存工厂
export const onTotalArea = (formData) => {
  return $http(`${url}lightAllConf/save/area/on_total_area`, 'post', 'multipart/form-data', formData)
}
// 保存灯
export const confArea = (formData) => {
  return $http(`${url}lightAllConf/modify/conf_area`, 'post', 'multipart/form-data', formData)
}
// 获取灯
export const deviceList = (deviceType) => {
  return $gAjax(`${url}lightAllConf/find/device_list?deviceType=${deviceType}&time=${Math.random()*100}`)
}
