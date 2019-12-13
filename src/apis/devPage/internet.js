import {
  getAjax as $gAjax,
  ipWsMonitor
} from '../../axios/axiosFn.js'

let url = ipWsMonitor;
// 提交
export const netstats = () => {
  return $gAjax(`${url}netstats?time=${Math.random()*100}`)
}
