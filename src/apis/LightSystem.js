import {
  http as $http,
  ipNormal
} from '../axios/axiosFn.js'

let url = ipNormal;
// 更新
export const updateUserDefined = (formData) => {
  return $http(`${url}sysSeting/updateUserDefined`, 'post', 'multipart/form-data', formData)
}
// 添加
export const insertUserDefined = (formData) => {
  return $http(`${url}sysSeting/insertUserDefined`, 'post', 'multipart/form-data', formData)
}
