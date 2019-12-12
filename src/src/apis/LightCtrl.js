import {
  getAjax as $gAjax,
  postAjax as $pAjax,
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 获取分组
export const findLightCategory = (zoneId) => {
  return $gAjax(`${url}lightCtrl/ctrl/findLightCategory/${zoneId}?time=${Math.random()*100}`)
}
// 热力图
export const currentThermalDiagram = (zoneName) => {
  return $gAjax(`${url}thermal_diagram/find/currentThermalDiagram?areaName=${zoneName}&time=${Math.random()*100}`)
}
// 照明控制
export const switchFn = (stateAjax, addrs, brightness, indBright, unindBright, indTime, ) => {
  return $pAjax(`${url}lightCtrl/switch`, {
    op: stateAjax,
    devices: addrs,
    brightness: brightness,
    indBright: indBright,
    unindBright: unindBright,
    indTime: indTime,
    source: 'web'
  })
}
// 人感
export const peoplefeel = (stateAjax, addrs, indBright, unindBright, indTime, ) => {
  return $pAjax(`${url}lightCtrl/peoplefeel`, {
    op: stateAjax,
    devices: addrs,
    brightness: '-1',
    indBright: indBright,
    unindBright: unindBright,
    indTime: indTime,
    source: 'web',
  })
}
// 热力图点击
export const weekThermalDiagram = (zoneName) => {
  return $gAjax(`${url}thermal_diagram/find/weekThermalDiagram?areaName=${zoneName}&time=${Math.random()*100}`)
}
// 热力图点击
export const ThermalDiagramofDay = (dateTime, shortAddr) => {
  return $gAjax(`${url}thermal_diagram/find/ThermalDiagramofDay?dateTime=${dateTime}&shortAddr=${shortAddr}&time=${Math.random()*100}`)
}
// 删除分组
export const removeLightCategory = (id) => {
  return $gAjax(`${url}lightCtrl/ctrl/removeLightCategory/${id}?time=${Math.random()*100}`)
}
// 获取工厂信息
export const findLightConfAreaTemp = () => {
  return $gAjax(`${url}lightCtrl/ctrl/findLightConfAreaTemp/web?time=${Math.random()*100}`)
}
// 能源管理弹出   电压电流分析
export const analyse = (shortAddr) => {
  return $gAjax(`${url}lightStatistic/find/power/analyse/${shortAddr}?time=${Math.random()*100}`)
}
// 新建分组
export const saveLightCategory = (formData) => {
  return $http(`${url}lightCtrl/ctrl/saveLightCategory`, 'post', 'multipart/form-data', formData)
}
