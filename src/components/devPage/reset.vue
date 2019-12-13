<template>
<div id="reset">
  <el-button type="primary" style="margin-bottom: 20px" plain @click="sendReset">重置项目</el-button>
  <el-timeline>
    <el-timeline-item :timestamp="item[0].tit" placement="top" v-for="(item, index) in resetList" :key="index" :color="item[item.length - 1 ].color">
      <el-card>
        <!-- <h4>更新 Github 模板</h4> -->
        <p class="msgP" v-for="(v, i) in item" :key="`v${i}`">{{v.msg}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
  <!-- <ul class="resultBox">
    <transition-group name="v">
      <li v-for="(item, index) in resetList" :class="{finished: item.color === 1}" :key="item.msg"><i :class="[item.color === 1? 'el-icon-success': 'el-icon-error']"></i>{{item.msg}}</li>
    </transition-group>
  </ul> -->
</div>
</template>

<script>
export default {
  name: "reset",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      resetList: [],
      websock: null,
      sendMsg: ''
    };
  },
  methods: {
    sendReset() {
      this.$prompt('请输入项目名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '项目名不正确'
      }).then(({
        value
      }) => {
        this.sendMsg = value;
        this.resetList = [];
        this.initWebpack();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
      // setInterval(() => {
      //   this.resetList.push({
      //     msg: 'finished',
      //     color: 1
      //   })
      //   $('.resultBox')[0].scrollTop = $('.resultBox')[0].scrollHeight;
      // }, 1000)
    },
    initWebpack() {
      // console.log(this.websockUrl);
      //初始化websocket
      this.websock = `ws://${this.ipWsMonitor}/clearback`;
      this.websock = new WebSocket(this.websock); //这里面的this都指向vue
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
      this.websock.onerror = this.websocketerror;
    },
    websocketopen() {
      //打开
      console.log("WebSocket连接成功");
      this.websocketonsend();
    },
    websocketonmessage(e) {
      //数据接收
      console.log(e.data)
      if (e.data.includes(' -> ')) {
        if (this.resetList[0] == undefined || e.data.split(' -> ')[0] === (this.resetList[this.resetList.length - 1][0].tit)) {
          this.resetList[0] == undefined ? this.resetList = [
            []
          ] : this.resetList = this.resetList;
          this.resetList[this.resetList.length - 1].push({
            tit: e.data.split(' -> ')[0],
            msg: e.data.split(' -> ')[1],
            color: e.data.split(' -> ')[0] === 'error' ? '#F56C6C' : '#67C23A'
          })
        } else {
          this.resetList.push([{
            tit: e.data.split(' -> ')[0],
            msg: e.data.split(' -> ')[1],
            color: e.data.split(' -> ')[0] === 'error' ? '#F56C6C' : '#67C23A'
          }])
        }
      }
      // console.log(this.resetList)
      // console.log($('.el-timeline')[0])
      setTimeout(() => {
        $('.el-timeline')[0].scrollTop = $('.el-timeline')[0].scrollHeight;
      }, 1000)
      // this.lights = JSON.parse(e.data);
    },
    websocketonsend(e) {
      if (this.websock) {
        // console.log(this.zoneId)
        this.websock.send(this.sendMsg);
      }
    },
    websocketclose(source) {
      console.log("WebSocket关闭")
      //关闭
      if (this.websock) {
      //   // this.websocketonsend();
        this.websock.close();
      }
    },
    websocketerror() {
      //失败
      console.log("WebSocket连接失败");
      let _this = this;
      if ( location.hash == "#/devPageBox/reset" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
        setTimeout(() => {
          _this.initWebpack();
          _this = null;
        }, 5000)
      }
    },
  },
  mounted() {},

  destroyed() {
    this.websocketclose('web');
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#reset {
  height: 100%;
  .el-timeline {
    text-align: left;
    width: 600px;
    margin: auto;
    height: calc(100% - 70px);
    overflow-y: auto;
    padding: 0 10px;
    border: 1px solid #ccc;
  }
  .msgP {
    height: 26px;
    font-size: 14px;
  }
   // .resultBox {
  //   line-height: 30px;
  //   margin-top: 10px;
  //   height: calc(100% - 50px);
  //   border-radius: 4px;
  //   border: 1px solid #c0c4cc;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  //   overflow-y: auto;
  //   li {
  //     font-size: 20px;
  //     color: #F56C6C;
  //     &.finished {
  //       color: #67C23A;
  //     }
  //   }
  // }
  // .v-enter,
  // .v-leave-to {
  //   opacity: 0;
  //   transform: translateY(40px);
  // }
  // .v-enter-active,
  // .v-leave-active {
  //   transition: all 0.6s ease;
  // }
  // /*v-move 和 v-leave-active 配合使用，能够实现列表后续的元素，渐渐地漂上来的效果 */
  // .v-move {
  //   transition: all 0.6s ease;
  // }
  // .v-leave-active {
  //   position: absolute;
  // }
}
</style>
