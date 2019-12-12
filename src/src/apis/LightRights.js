import {
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 提交
export const insertFeedback = (formData) => {
  return $http(`${url}rebackinfo/insertFeedback`, 'post', 'application/x-www-form-urlencoded', formData)
}
