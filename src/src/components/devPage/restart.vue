<template>
<div id="restart" v-loading="loading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
  <div class="fl">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(item,index) in server" :label="item.name" :key="index" border>{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <div style="margin: 15px 0;"></div>
    <el-button type="primary" style="margin-bottom: 20px" plain @click="sendRestart(0)">启动</el-button>
    <!-- <el-button type="primary" style="margin-bottom: 20px" plain @click="sendRestart(1)">停止</el-button> -->
    <el-button type="primary" style="margin-bottom: 20px" plain @click="sendRestart(2)">重新启动</el-button>
  </div>
  <el-timeline>
    <el-timeline-item :timestamp="item[0].tit" placement="top" v-for="(item, index) in resetList" :key="index" :color="item[item.length - 1 ].color">
      <el-card>
        <!-- <h4>更新 Github 模板</h4> -->
        <p class="msgP" v-for="(v, i) in item" :key="`v${i}`">{{v.msg}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
</template>

<script>
let serverArr = ['customer', 'pro', 'monitor', 'mysql', 'mongo', 'mqtt', 'redis'];
export default {
  name: "restart",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      loadingText: '重启中,30s',
      loading: false,
      checkAll: false,
      checkedCities: [],
      server: [{
        name: 'customer'
      }, {
        name: 'pro'
      }, {
        name: 'monitor'
      }, {
        name: 'mysql'
      }, {
        name: 'mongo'
      }, {
        name: 'mqtt'
      }, {
        name: 'redis'
      }],
      isIndeterminate: true,
      resetList: [],
      websock: null,
      sendMsg: '',
      time: null,
      n: 30
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? serverArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkedCities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < serverArr.length;
    },
    sendRestart(n) {
      this.$confirm('确定执行此操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '项目名不正确'
      }).then(() => {
        if (this.checkedCities.includes('monitor')) {
          this.checkedCities.splice(this.checkedCities.findIndex(item => item === 'monitor'), 1);
          this.checkedCities.push('monitor');
        }
        this.sendMsg = JSON.stringify({
          'server': this.checkedCities.join('-'),
          'flag': n
        });
        this.resetList = [];
        console.log(this.sendMsg)
        this.initWebpack();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    initWebpack() {
      // console.log(this.websockUrl);
      //初始化websocket
      this.websock = `ws://${this.ipWsMonitor}/restartTo`;
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
      if ((this.checkedCities.includes('monitor') && this.checkedCities.length === 1)) {
        console.log(this.checkedCities.includes('monitor'))
        console.log(this.checkedCities.length === 1)
        this.resetList = [];
      } else {
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
        console.log(this.resetList)
        console.log($('.el-timeline')[0])
        setTimeout(() => {
          $('.el-timeline')[0].scrollTop = $('.el-timeline')[0].scrollHeight;
        }, 10)
      }

      // this.lights = JSON.parse(e.data);
    },
    websocketonsend(e) {
      if (this.websock) {
        console.log(this.sendMsg)
        this.websock.send(this.sendMsg);
      }
    },
    websocketclose(source) {
      console.log("WebSocket关闭")
      console.log(this.checkedCities);
      this.getTime();
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
      if (location.hash == "#/devPageBox/restart" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
        setTimeout(() => {
          _this.initWebpack();
          _this = null;
        }, 5000)
      }
    },
    getTime() {
      if (this.checkedCities.includes('monitor')) {
        let _this = this;
        if (this.n > 0) {
          this.loading = true;
          this.time = setTimeout(function() {
            clearTimeout(_this.time);
            _this.time = null;
            _this.n--;
            _this.loadingText = `重启中,${_this.n}s`
            _this.getTime();
          }, 1000);
        } else {
          this.loading = false;
          console.log(this.checkedCities)
          this.resetList.push(
            [{
              tit: 'monitor',
              msg: 'restart  monitor start to exec',
              color: '#67C23A'
            }, {
              tit: 'monitor',
              msg: 'restart  monitor result.........light_v3mysql',
              color: '#67C23A'
            }]);
          this.resetList.push(
            [{
              tit: 'end',
              msg: 'end',
              color: '#67C23A'
            }]);
          setTimeout(() => {
            $('.el-timeline')[0].scrollTop = $('.el-timeline')[0].scrollHeight;
          }, 10)
          console.log(this.resetList)
        }
      }
    }
  },
  mounted() {},
  destroyed() {
    this.websocketclose('web');
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#restart {
  width: 1000px;
  margin: 0 auto;
  position: relative;
  .el-loading-spinner {
    width: 140px;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 140px;
    border-radius: 50%;
    background: #fff;
    top: 50%;
    padding: 42px 35px;
  }
  .el-loading-spinner i {
    margin-bottom: 10px;
  }
  .el-checkbox {
    margin-bottom: 20px;
  }
  .el-checkbox-group {
    width: 100%;
    overflow: hidden;
    padding-right: 60px;
    .el-checkbox {
      margin: 0;
      margin-bottom: 28px;
      overflow: hidden;
      width: 120px;
    }
    .el-checkbox:nth-of-type(2n) {
      float: right;
    }
    .el-checkbox:nth-of-type(2n - 1) {
      float: left;
    }
  }
  .el-button {
    width: 120px;
    +.el-button {
      margin-left: 46px;
    }
  }
  height: 100%;
  >.fl {
    width: 350px;
    text-align: left;
    @include position(absolute, 38%, none, none, 0);
    transform: translateY(-50%);
  }
  .el-timeline {
    text-align: left;
    width: calc(100% - 350px);
    margin: auto;
    height: 100%;
    overflow-y: auto;
    padding: 0 10px;
    float: right;
    border: 1px solid #ccc;
    padding: 20px;
  }
  .msgP {
    height: 26px;
    font-size: 14px;
  }
}
</style>
