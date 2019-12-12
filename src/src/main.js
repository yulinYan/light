// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
// import Vuex from 'vuex'
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from "moment";
import $ from 'jquery';
// import Echarts from 'echarts'
// Vue.prototype.echarts = Echarts
// Vue.use(Echarts)
// import store from './store/store'
import {
  getAjax,
} from './axios/axiosFn.js'
const Bus = new Vue();

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(Vuex);
Vue.prototype.$moment = moment;
Vue.prototype.$gAjax = getAjax;


/* eslint-disable no-new */
if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.$gAjax('serverconfig.json').then((result) => {
      let ip = window.location.href.split('://')[1].split('/')[0].split('#')[0];
      Vue.prototype.ipNormal = 'http://' + ip + result.data.ipNormal; //设置成Vue的全局属性
      Vue.prototype.ipPix = 'http://' + ip + result.data.ipPix; //设置成Vue的全局属性
      Vue.prototype.ipPro = 'http://' + ip + result.data.ipPro; //设置成Vue的全局属性
      Vue.prototype.ipWs = ip + result.data.ipWs; //设置成Vue的全局属性
      Vue.prototype.ipWsMonitor = ip + result.data.ipWsMonitor; //设置成Vue的全局属性

    new Vue({
      el: '#app',
      router,
      // store,
      components: {
        App
      },
      data() {
        return {
          Bus
        }
      },
      template: '<App/>'
    })

  /* eslint-disable no-new */
  }).catch((error) => {
    console.log(error)
  })
}else{
  Vue.prototype.ipNormal = 'http://192.168.2.222:82/customer'; //设置成Vue的全局属性
  Vue.prototype.ipPix = 'http://192.168.2.222:82'; //设置成Vue的全局属性
  Vue.prototype.ipPro = 'http://192.168.2.222'; //设置成Vue的全局属性
  Vue.prototype.ipWs = '192.168.2.222:82/customer'; //设置成Vue的全局属性
  Vue.prototype.ipWsMonitor = '192.168.2.222:8887/api/v1'; //设置成Vue的全局属性

  new Vue({
    el: '#app',
    router,
    // store,
    components: {
      App
    },
    data() {
      return {
        Bus
      }
    },
    template: '<App/>'
  })
}



