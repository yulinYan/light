<template>
<div id="devPageBox" v-loading="loading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">

  <el-header height="60px">
    <router-link to="/login"><img src="../../assets/img/LightBox/tuichu.png" alt=""></router-link>
    <span>{{time}}</span>
  </el-header>
  <el-container>
    <!-- <transition name="fade"> -->
    <el-aside width="200px">
      <!-- <div>项目</div> -->
      <ul>
        <li v-for="(item,index) in factoryList" :key="index" :class="{ active: item.active }">
          <span>
            <router-link :to="{path: item.router}" @click.native="changeActive(index)">{{item.project_name}}
            </router-link>
            </span>
        </li>
      </ul>
    </el-aside>
    <!-- </transition> -->
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</div>
</template>

<script>
export default {
  name: "devPageBox",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      time: "",
      userName: '',
      factoryList: [],
      loading: false,
      loadingText: '拼命加载中'
    };
  },
  methods: {
    //获取首页信息logo标题等
    b64EncodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
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
      let arr = [];
      // console.log(this.$router.options.routes[2])
      this.$router.options.routes[3].children.forEach((v, i) => {
        arr.push({
          project_name: v.mode[0],
          active: this.$route.name == v.path ? true : false,
          router: `/devPageBox/${v.path}`
        })
      })
      this.factoryList = arr;
      arr = null;
      console.log(this.factoryList)
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
  mounted() {
    this.$root.Bus.$on("showLoading", (bool, text) => {
      if (bool) {
        this.loading = true;
        text === undefined ? '拼命加载中' : text;
        console.log(text)
      } else {
        this.loading = false;
      }
    });
    this.getTime();
    this.getRouter();
    this.changeActive();
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#devPageBox {
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
  .el-header {
    position: relative;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);
    z-index: 2;
    background: #fff url('../../assets/img/LightBox/logo.png') no-repeat 50px center;
    line-height: 60px; // @include media($m1660) {
    //   background: #ffffff url('./assets/img/LightBox/daohanglan1440.png') no-repeat left center;
    // }
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
      color: #505050;
    }
    a {
      color: #505050;
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
    background-color: #fafafa;
    text-align: center;
    height: 100%;
    overflow: visible;
    z-index: 1;
    @include media($m1280) {
      width: 160px !important;
    }
    ul {}
    div,
    li {
      height: 54px;
      @include media($m1366) {
        height: 44px;
      }
      span {
        width: 100%;
        height: 100%;
        @include media($m1280) {
          padding-left: 12px;
        }
        float: left;
      }
      img {
        margin-right: 16px;
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
        font-size: 14px; // @include media($m1660) {
        //   margin: 18px 0;
        // }
        // @include media($m1366) {
        //   margin: 14px 0;
        // }
        // font-size: 14px;
        // @include media($m1440) {
        //   font-size: 14px;
        // }
        @include text-overflow; // width: 146px;
        color: #101010;
      }
    }
  }
  .el-main {
    // #totleMsg{
    //   height: 40px;
    // }
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);
    margin-left: 2px;
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
  } // .fade-enter-active {
  //   animation: sideMove .5s;
  // }
  // .fade-leave-active {
  //   animation: sideMove .5s reverse;
  // }
  // @keyframes btnMove {
  //   0% {
  //     width: 200px;
  //   }
  //   100% {
  //     width: 0;
  //   }
  // }
}
</style>
