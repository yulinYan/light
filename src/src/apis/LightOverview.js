import {
  getAjax as $gAjax,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 首页上面四个模块
export const getHomeTop = () => {
  return $gAjax(`${url}homePage/getHomeTop?${Math.random()*100}`)
}
// 节能对比
export const compNowAndBefore = () => {
  return $gAjax(`${url}homePage/compNowAndBefore?${Math.random()*100}`)
}
// 当天能耗
export const analyse = () => {
  return $gAjax(`${url}lightStatistic/find/power/analyse?${Math.random()*100}`)
}
// 策略
export const week = () => {
  return $gAjax(`${url}homePage/energy/week?${Math.random()*100}`)
}
// 策略
export const strategy = () => {
  return $gAjax(`${url}homePage/strategy?${Math.random()*100}`)
}
