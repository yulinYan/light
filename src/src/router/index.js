import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/login';
import {
  Message,
} from 'element-ui'

Vue.use(Router)
let router = new Router({
  routes: [{
      path: '/',
      redirect: {
        name: 'Login'
      },
    },
    {
      path: '/Login',
      name: 'Login',
      mode: ['登陆'],
      component: Login,
    },
    {
      path: '/LightBox',
      name: 'LightBox',
      component: () =>
        import('@/LightBox'),
      children: [{
          path: 'LightOverview',
          name: 'LightOverview',
          mode: ['信息总览'],
          component: () =>
            import('@/LightOverview'),
        }, {
          path: 'LightCtrl',
          name: 'LightCtrl',
          mode: ['照明控制'],
          component: () =>
            import('@/LightCtrl'),
        }, {
          path: 'LightStatistics',
          name: 'LightStatistics',
          mode: ['能源统计'],
          component: () =>
            import('@/LightStatistics'),
        }, {
          path: 'LightTimed',
          name: 'LightTimed',
          mode: ['定时控制'],
          component: () =>
            import('@/LightTimed'),
        }, {
          path: 'LightSystem',
          name: 'LightSystem',
          mode: ['系统设置'],
          component: () =>
            import('@/LightSystem'),
        }, {
          path: 'LightRights',
          name: 'LightRights',
          mode: ['意见反馈'],
          component: () =>
            import('@/LightRights'),
        }, {
          path: 'LightSet',
          name: 'LightSet',
          mode: ['照明设置'],
          component: () =>
            import('@/LightSet'),
        }, {
          path: 'SetMap',
          name: 'SetMap',
          mode: ['照明设置2'],
          component: () =>
            import('@/SetMap'),
        },
      ]
    },
    {
      path: '/devPageBox',
      name: 'devPageBox',
      mode: ['隐藏界面'],
      component: () =>
        import('@/components/devPage/devPageBox'),
      children: [{
        path: 'reset',
        name: 'reset',
        mode: ['清空数据'],
        component: () =>
          import('@/components/devPage/reset'),
      }, {
        path: 'restart',
        name: 'restart',
        mode: ['重启项目'],
        component: () =>
          import('@/components/devPage/restart'),
      }, {
        path: 'mqtt',
        name: 'mqtt',
        mode: ['mqtt'],
        component: () =>
          import('@/components/devPage/mqtt'),
      }, {
        path: 'internet',
        name: 'internet',
        mode: ['网络状况'],
        component: () =>
          import('@/components/devPage/internet'),
      }, {
        path: 'system',
        name: 'system',
        mode: ['系统版本'],
        component: () =>
          import('@/components/devPage/system'),
      }, {
        path: 'delLight',
        name: 'delLight',
        mode: ['删除灯'],
        component: () =>
          import('@/components/devPage/delLight'),
      }, ]
    },
    {
      path: '/lightConfig',
      name: 'lightConfig',
      mode: ['照明纠错'],
      component: () =>
        import('@/lightConfig'),
    },
    {
      path: '/*',
      name: 'error-404',
      meta: {
        title: '404-页面不存在'
      },
      component: () => import('@/components/error-page/404'),
    }
  ]
});

router.beforeEach((to, from, next) => {
  let menuTree = JSON.parse(sessionStorage.getItem('menuTree'));
  if (to.name == "Login" || to.fullPath.includes('devPageBox')) {
    // router.options.routes[2].children = [];
    next();
  } else {
    if (menuTree != null) {
      if (to.fullPath == '/LightBox') {
        next({
          path: '/Login'
        })
      }
      router.options.routes[2].children = menuTree[0].children;
      let go = false;
      router.options.routes[2].children.forEach((v, i) => {
        if (v.path === to.name) {
          go = true;
        }
      })
      // console.log(to.name)
      if (go || to.name == 'SetMap' || to.name == 'lightConfig' || to.name == 'LightHide') {
        if (to.name === 'LightCapacity' && localStorage.getItem('lightRemote') != 1) {
          Message.error('您没有访问该页面的权限,请重新登录');
        } else {
          next();
        }
      } else {
        Message.error('您没有访问该页面的权限');
      }
      // if(to.path)
      // if (from.meta[0] && from.meta[0] == 0) {

      // }else{

      // }
    } else {
      next({
        path: '/Login'
      })
    }
  }
})

export default router;
