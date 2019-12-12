import {
  getAjax as $gAjax,
  postAjax as $pAjax,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 区域表单
export const zoneForm = () => {
  return $gAjax(`${url}lightStatistic/find/power/zoneForm?time=${Math.random()*100}`)
}
// 厂区下拉框
export const list = () => {
  return $gAjax(`${url}lightStatistic/power/zone/list?time=${Math.random()*100}`)
}
// 统计报表
export const report = (obj) => {
  return $pAjax(`${url}lightStatistic/power/report`, obj)
}
