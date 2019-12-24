import axios from './request.js';
import {
  Message,
} from 'element-ui'
var ipNormal = '',
  ipWsMonitor = '';
if (process.env.NODE_ENV !== 'development') {
  ipNormal = 'http://' + window.location.href.split('://')[1].split('/')[0].split('#')[0] + '/customer/api/v1/';
  ipWsMonitor = 'http://' + window.location.href.split('://')[1].split('/')[0].split('#')[0] + '/monitor/api/v1/'
} else {
  ipNormal = 'http://192.168.2.222:82/customer/api/v1/';
  ipWsMonitor = 'http://192.168.2.222:82/monitor/api/v1/';
}
export {
  ipNormal, ipWsMonitor
};
export function getAjax(url, params = {}) {
  return new Promise((reslove, reject) => {
    axios.get(url, {
        params: params
      })
      .then(res => {
        reslove(res);
      })
      .catch(err => {
        if (err.response) {
          Message.error(err.response.data.message)
        }
        reject(err)
      })
  })
}
export function postAjax(url, params = {}) {
  return new Promise((reslove, reject) => {
    axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        reslove(res);
      })
      .catch(err => {
        if (err.response) {
          Message.error(err.response.data.message)
        }
        reject(err)
      })
  })
}
export function http(url, type, headers, params = {}) {
  return new Promise((reslove, reject) => {
    axios({
      url: url,
      method: type,
      data: params,
      headers: {
        'Content-Type': headers
      },
    }).then(res => {
      reslove(res)
    }).catch(err => {
      if (err.response) {
        Message.error(err.response.data.message)
      }
      reject(err)
    })
  })
}
