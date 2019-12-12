import {
  getAjax as $gAjax,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;

export const getUserDefined = () => {
  return $gAjax(`${url}sysSeting/getUserDefined?${Math.random()*100}`)
}
