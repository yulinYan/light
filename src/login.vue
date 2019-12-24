<template>
<div style="height:100%;width:100%">
  <section class="login-box">
    <div class="imgBox">
      <img :src="background" alt="">
    </div>
    <div class="box">
      <div class="form">
        <p><img :src='logoImg' alt="logo"></p>
        <h1 v-html="h1" ref="h1"></h1>
        <div class="formName el-form-item">
          <input placeholder="User" v-model="form.name"/>
        </div>
        <div class="el-form-item">
          <input placeholder="Password" v-model="form.password" type="password" :show-password="true"/>
        </div>
        <div class="setPassword">
        </div>
        <div @click="onSubmit">
          <button style="cursor:pointer">立即登录</button>
        </div>
      </div>
    </div>
    <div class="h6">
      <router-link to="/devPageBox/reset">
        <p>智慧照明系统</p>
      </router-link>
      <p><img src="./assets/img/login/font.png" alt=""></p>
    </div>
  </section>
</div>
</template>
<script>
// 图片
import logoImg from './assets/img/login/logo.png';
import background from './assets/img/login/bg.png';
// 接口
import {
  getUserDefined
} from './apis/login.js';
export default {
  name: 'login',
  data() {
    return {
      h1: '欢迎使用智慧照明系统',
      logoImg: logoImg,
      background: background,
      form: {
        name: '',
        password: '',
      },
      menuTree: {}
    };
  },
  methods: {
    // 获取谷歌版本号友好提示
    getChromeVersion() {
      let arr = navigator.userAgent.split(' ');
      let chromeVersion = '';
      for (let i = 0; i < arr.length; i++) {
        if (/chrome/i.test(arr[i]))
          chromeVersion = arr[i]
      }
      if (chromeVersion) {
        return Number(chromeVersion.split('/')[1].split('.')[0]);
      } else {
        return false;
      }
    },
    //获取首页信息logo标题等
    b64EncodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    getSysCustom() {
      getUserDefined()
        .then(res => {
          if (res.resultCode == 'success' && res.data) {
            if (res.data.titleStyle && res.data.titleStyle != '') {
              this.h1 = res.data.titleStyle;
              setTimeout(() => {
                // ico
                document.title = this.$refs.h1.innerText;
                var linkEle = document.getElementById("link");
                linkEle.href = this.b64EncodeUnicode(res.data.headerMap);
                linkEle.type = 'image/x-icon';
              }, 0)
            }
            if (res.data.logow && res.data.logow != '') {
              this.logoImg = this.b64EncodeUnicode(res.data.logow);
            }
            if (res.data.webMaps && res.data.webMaps != '') {
              this.background = this.b64EncodeUnicode(res.data.webMaps);
            }
          }
        })
    },
    // 点击提交
    onSubmit() {
      // if (this.form.name != '' && this.form.password != '') {
      if (this.form.name == 'lightadmin' && this.form.password == '000000') {
        this.$message({
          message: '登录中,请稍后',
          type: 'info',
        });
        sessionStorage.setItem('menuTree', `[{"path":"/LightBox","name":"LightBox","children":[{"path":"LightOverview","name":"LightOverview","mode":["信息总览"],"component":"@/LightOverview"},{"path":"LightCtrl","name":"LightCtrl","mode":["照明控制"],"component":"@/LightCtrl"},{"path":"LightTimed","name":"LightTimed","mode":["定时控制"],"component":"@/LightTimed"},{"path":"LightStatistics","name":"LightStatistics","mode":["能源统计"],"component":"@/LightStatistics"},{"path":"LightSystem","name":"LightSystem","mode":["系统设置"],"component":"@/LightSystem"},{"path":"LightRights","name":"LightRights","mode":["意见反馈"],"component":"@/LightRights"},{"path":"LightSet","name":"LightSet","mode":["照明设置"],"component":"@/LightSet"}]}]`);
        this.$router.push({
          path: `/LightBox/LightOverview`,
        })
        // this.$gAjax(`${this.url}login?login_name=${this.form.name}&password=${this.form.password}`)
        //   .then(res => {
        //     if (res.resultCode == 'success' && res.data.menusList != 0) {
        //       if (res.data.menusList.length == 0) {
        //         this.$message({
        //           message: '该角色无权限',
        //           type: 'info',
        //         });
        //       } else {
        //         let children = [];
        //         res.data.menusList.forEach((v, i) => {
        //           children.push({
        //             path: v.url,
        //             name: v.url,
        //             mode: [v.menuName],
        //             component: '@/' + v.url
        //           })
        //         })
        //         this.menuTree = [{
        //           path: '/LightBox',
        //           name: 'LightBox',
        //           component: () =>
        //             import ('@/LightBox'),
        //           children: [...children]
        //         }]
        //         children = null;
        //         sessionStorage.setItem('menuTree', JSON.stringify(this.menuTree));
        //         sessionStorage.setItem('stringPermissions', JSON.stringify(res.data.stringPermissions));
        //         // console.log(res.data.sysUser.loginName)
        //         sessionStorage.setItem('loginName', res.data.sysUser.loginName);
        //         this.$router.push({
        //           path: `/LightBox/${this.menuTree[0].children[0].name}`,
        //           // name:'LightOverview'
        //         })
        //       }
        //     } else {
        //       this.$message({
        //         message: res.data.msgs,
        //         type: 'error',
        //       });
        //     }
        //   })["catch"](() => {
        //     this.$message({
        //       message: '服务器无响应,请重试',
        //       type: 'error',
        //     });
        //   });
      } else {
        this.$message({
          message: '用户名或密码错误',
          type: 'error',
          showClose: true,
          duration: 3000,
        });
      }
    }
  },
  mounted() {
    sessionStorage.clear();
    localStorage.clear();
    let userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) {
      if (this.getChromeVersion() < 60) {
        this.$message({
          message: '请使用新版本谷歌、360、IE11访问本页面',
          type: 'error',
          showClose: true,
          duration: 3000,
        });
      }
    } else if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Safari") > -1 || userAgent.indexOf("Opera") > -1 || (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !(userAgent.indexOf("Opera") > -1))) {
      this.$message({
        message: '请使用新版本谷歌、360、IE11访问本页面',
        type: 'error',
        showClose: true,
        duration: 3000,
      });
    }
    // if (!!window.ActiveXObject || "ActiveXObject" in window) {
    //   console.log('ie11');
    // }
    this.getSysCustom();
    document.onkeydown = function(e) {
      if (e.keyCode == 13) {
        this.onSubmit();
      }
    }.bind(this);
  }
};
</script>

<style scoped lang='scss'>
@import "./assets/styles/common";
.login-box {
  height: 100%;
  position: relative;
  overflow: hidden;
  @include media($m1660) {
    background-size: contain !important;
  }
  ;
  >.imgBox {
    @include position(absolute, 0, none, none, 0);
    width: 66%;
    height: 100%;
    overflow: hidden;
    background-color: #b6b7bc;
    img {
      height: 100%;
    }
  }
  >img {
    @include position(absolute, 90px, none, none, 80px);
    @include media($m1440) {
      left: 60px;
    }
    ;
    @include media($m800) {
      width: 150px;
      left: 20px;
    }
    ;
  }
  >.h6 {
    @include position(absolute, none, none, 138px, 80px);
    @include media($m1440) {
      left: 60px;
    }
    ;
    @include media($m800) {
      left: 20px;
    }
    ;
    p:first-child {
      font-weight: bold;
      font-size: 20px;
      color: #ffffff;
      text-align: left;
      margin: 0 0 18px 4px;
    }
    p:last-child img {
      @include media($m1440) {
        width: 600px;
      }
      ;
      @include media($m1024) {
        width: 400px;
      }
      ;
    }
  }
  div.box {
    width: 34%;
    height: 100%;
    @include position(absolute, 0, 0, none, none);
    .form {
      width: 380px;
      height: 450px;
      color: #303030;
      @include position(absolute, 50%, none, none, 50%); // background-color: #fff;
      transform: translate(-50%, -50%);
      @include media($m1024) {
        width: 300px;
      }
      ;
      @include media($m800) {
        width: 200px;
      }
      ;
      h1 {
        font-size: 18px;
        font-weight: bold;
        color: #303030;
        margin: 30px 0 50px;
        @include media($m800) {
          font-size: 14px;
        }
        ;
      }
      .el-form-item {
        padding: 0 13px;
        overflow: hidden;
        &.formName {
          margin-bottom: 38px;
          @include media($m800) {
            margin-bottom: 20px;
          }
          ;
        }
        input {
          border: none;
          border-bottom: solid 1px #c4c4c4;
          background-color: transparent;
          font-size: 16px;
          height: 32px;
          line-height: 32px;
          outline: none;
          width: 100%;
          @include media($m800) {
            font-size: 12px;
          }
          ;
        }
      }
      .setPassword {
        padding: 0 13px;
        display: flex;
        justify-content: space-between;
        margin-top: -10px;
        @include media($m1280) {
          margin-top: 0px;
        }
        ;
        span {
          cursor: pointer;
          color: #306df2;
          font-size: 14px;
          @include media($m800) {
            font-size: 12px;
          }
          ;
        }
      }
      >div:last-child {
        margin: 68px auto 0;
        width: 350px;
        height: 40px;
        @include media($m1024) {
          width: 300px;
        }
        ;
        @include media($m1024) {
          width: 200px;
        }
        ;
        >button {
          width: 350px;
          height: 40px;
          background: #3c70d7;
          font-size: 16px;
          color: #ffffff;
          border-radius: 4px;
          @include media($m1024) {
            width: 300px;
          }
          ;
          @include media($m1024) {
            width: 200px;
          }
          ;
        }
      }
    }
  }
}
</style>
