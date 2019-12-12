<template>
<div id="LightBox" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
  <!-- <el-container> -->
  <el-header v-if="!toggleAsideFlag" height="60px" :style="{'background-image':'url('+headerImg+')'}">
    <h1 class="h1Tit" v-html="h1"></h1>
    <router-link to="/login"><img src="./assets/img/LightBox/tuichu.png" alt=""></router-link>
    <span>{{time}}</span>
  </el-header>
  <el-container>
    <el-aside width="180px">
      <ul>
        <li v-for="(item,index) in factoryList" :key="index" :class="{ active: item.active }">
          <span>
            <router-link :to="{path: item.router}" @click.native="changeActive(index)">
              <img v-if="item.active" :src="require(`./assets/img${item.router}2.png`)" alt="icon">
              <img v-else :src="require(`./assets/img${item.router}1.png`)" alt="icon">
              {{item.project_name}}
            </router-link>
            </span>
        </li>
      </ul>
      <div class="LightOpen" @click="goLightConfig"></div>
    </el-aside>
    <el-main>
      <div id="totleMsg"></div>
      <router-view />
    </el-main>
  </el-container>
</div>
</template>

<script>
import headerImg from './assets/img/LightBox/logo.png';
import hideAside from './assets/img/LightBox/hide.png';
import showAside from './assets/img/LightBox/show.png';
import {
  getUserDefined
} from './apis/login.js'
export default {
  name: "LightBox",
  data() {
    return {
      loading: false,
      headerImg: headerImg,
      h1: '智慧照明管理系统',
      toggleAsideImg: '',
      toggleAsideTitle: '点击隐藏',
      time: "",
      userName: '',
      factoryList: [],
      menuTree: '',
      LightConfigNum: 1,
      LightConfigTime: [],
      toggleAsideFlag: false,
    };
  },
  methods: {
    // 远程调光是否开启
    getHiddenSave(num) {
      this.getRouter(num);
    },
    // 侧边栏回收展开
    toggleAside() {
      this.toggleAsideFlag = !this.toggleAsideFlag;
      if (this.toggleAsideFlag) {
        this.toggleAsideImg = showAside;
        this.toggleAsideTitle = '点击显示';
      } else {
        this.toggleAsideImg = hideAside;
        this.toggleAsideTitle = '点击隐藏';
      }
      var myEvent = new Event('resize');
      window.dispatchEvent(myEvent);
    },
    // 隐藏页面
    goLightConfig() {
      // this.LightConfigTime.push((new Date()).getTime());
      // if (this.LightConfigTime.length >= 2 && this.LightConfigTime.length <= 5) {
      //   if (this.LightConfigTime[(this.LightConfigTime.length - 1)] - this.LightConfigTime[(this.LightConfigTime.length - 2)] <= 500) {
      //     // console.log('--------------------------',this.LightConfigTime[(this.LightConfigTime.length - 1)] - this.LightConfigTime[(this.LightConfigTime.length - 2)])
      //     this.LightConfigNum++;
      //   } else {
      //     this.LightConfigNum = 1;
      //     this.LightConfigTime = [this.LightConfigTime[this.LightConfigTime.length - 1]];
      //   }
      // } else if (this.LightConfigTime.length > 5) {
      //   this.LightConfigNum = 1;
      //   this.LightConfigTime = [];
      // }
      // // console.log(this.LightConfigTime)
      // // console.log(this.LightConfigNum)
      // if (this.LightConfigNum == 5) {
      //   this.$router.push({
      //     path: '/LightHide',
      //     name: 'LightHide'
      //   })
      // }
    },
    //获取首页信息logo标题等
    b64EncodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    getSysCustom() {
      // let menuList = JSON.parse(sessionStorage.getItem('stringPermissions'));
      // if (menuList.includes('api:v1:sysSeting:sysSeting')) {
      getUserDefined()
        .then(res => {
          if (res.resultCode == 'success' && res.data) {
            this.h1 = res.data.titleStyle || this.h1;
            if (res.data.logon1 && res.data.logon1 != '') {
              if (window.innerWidth > 1660) {
                this.headerImg = this.b64EncodeUnicode(res.data.logon1);
              } else if (res.data.logon2 && res.data.logon2 != '') {
                this.headerImg = this.b64EncodeUnicode(res.data.logon2);
              }
            }
          }
        });
      // }
    },
    // 获取右上角实时时间
    getTime() {
      this.time = this.$moment(new Date()).format("YYYY.MM.DD HH:mm");
      let _this = this;
      if (window.CollectGarbage) {
        // console.log(window.CollectGarbage)
        CollectGarbage();
      }
      let t = setTimeout(function() {
        clearTimeout(t);
        t = null;
        _this.getTime();
        _this = null;
      }, 60000);
    },
    // 获取侧边栏并跳到首页
    getRouter(num) {
      this.factoryList = [];
      this.menuTree = sessionStorage.getItem('menuTree');
      if (!this.menuTree) {
        this.$router.push({
          path: '/Login',
          // name:'LightOverview'
        })
      }
      // this.userName = sessionStorage.getItem('loginName');
      let arr = [];
      console.log(this.$router.options.routes[2])
      this.$router.options.routes[2].children.forEach((v, i) => {
        if (this.menuTree) {
          // 根据权限判断侧边栏的显示隐藏
          if (v.path !== 'SetMap') {
            if (v.path === 'LightCapacity' && localStorage.getItem('lightRemote') != 1) {
              return;
            } else if (v.path === 'LightRay' && localStorage.getItem('lightRemote1') != 1) {
              return;
            }
            // let str =
            arr.push({
              project_name: v.mode[0],
              active: this.$route.name == v.path ? true : false,
              router: `/LightBox/${v.path}`,
            })
          }
        }
      })
      // arr.push({
      //   project_name: '远程调光',
      //   active:  false,
      //   router: `/LightBox/LightCapacity`
      // })
      this.factoryList = arr;
      arr = null;
      this.changeActive(num);
    },
    // 切换侧边栏
    changeActive(index) {
      // console.log(index)
      // console.log(this.factoryList)
      if (index != undefined) {
        this.factoryList.forEach((v, i) => {
          if (i == index) {
            v.active = true;
          } else {
            v.active = false;
          }
        })
      }
    }
  },
  created() {
    this.$root.Bus.$on("goLightFault", (num) => {
      if (num) {
        this.getHiddenSave(num);
        this.changeActive(num);
      }
    });
    // this.$root.Bus.$on("hideAsideFlag", (num) => {
    //   if (num) {
    //     this.toggleAsideFlag = true;
    //   }
    // });
    this.$root.Bus.$on("showLoading", (bool) => {
      if (bool) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    });
    this.getHiddenSave();
  },
  mounted() {
    this.toggleAsideImg = hideAside;
    this.getSysCustom();
    this.getTime();
  }
};
</script>

<style lang='scss'>
@import "./assets/styles/common";
#LightBox {
  .LightConfig {
    @include position(absolute, 0, none, none, 0);
    width: 50px;
    height: 100%;
  }
  .LightOpen {
    @include position(absolute, none, none, 0, 0);
    width: 50px;
    height: 50px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  font-family: "Avenir",
  Helvetica,
  Arial,
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-container {
    height: calc(100% - 60px);
    padding-top: 1px;
    @include media($m1366) {
      height: calc(100% - 50px);
    }
    @include media($m1280) {
      height: calc(100% - 40px);
    }
    background-color: #eef1f7;
  }
  .h1Tit {
    font-size: 16px;
    color: #101010;
    float: left;
    margin-left: 207px;
  }
  .el-header {
    position: relative; // box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);
    z-index: 2;
    background: #fff url('./assets/img/LightBox/logo.png') no-repeat 50px center;
    line-height: 60px;
    @include media($m1366) {
      line-height: 50px;
      height: 50px !important;
    }
    @include media($m1280) {
      line-height: 40px;
      height: 40px !important;
    }
    padding: 0 50px 0 0;
    span,
    a {
      float: right;
      font-size: 14px;
      @include media($m1440) {
        font-size: 12px;
      }
      color: #101010;
    }
    a {
      color: #101010;
    }
    span {
      margin-right: 20px;
    }
    img {
      margin: -2px 7px 0 0;
      vertical-align: middle;
    }
  }
  .el-aside {
    position: relative;
    background-color: #fff;
    text-align: center;
    height: 100%;
    overflow: visible;
    z-index: 1;
    @include media($m1280) {
      width: 160px !important;
    }
    div,
    li {
      height: 54px;
      @include media($m1366) {
        height: 44px;
      }
      span {
        width: 100%;
        height: 100%;
        padding-left: 46px;
        @include media($m1280) {
          padding-left: 29px;
        }
        float: left;
      }
      img {
        margin-right: 14px;
        vertical-align: sub;
      }
      &.active {
        border-left: 3px solid #61adf8;
        background-color: #eef1f7;
        width: calc(100% + 2px);
        span {
          margin-left: -3px;
        }
        a {
          color: #3f78f6;
        }
      }
      a {
        display: inline-block;
        display: block;
        margin: 19px 0;
        @include media($m1366) {
          margin: 14px 0;
        }
        font-size: 14px;
        text-align: left;
        @include text-overflow; // width: 146px;
        color: #101010;
      }
    }
  }
  .el-main {
    >img {
      @include position(fixed,
      42%,
      none,
      none,
      0);
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 3;
      &.show {
        @include position(fixed,
        42%,
        none,
        none,
        160px);
      }
    }
    position: relative;
    background-color: #eef1f7;
    text-align: center;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 30px 30px;
    @include media($m1366) {
      padding: 12px 25px;
    }
  }
}
</style>
