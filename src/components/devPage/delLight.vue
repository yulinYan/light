<template>
<div class="delLight">
  <el-button class="operateDiv" @click="getConfigForm">导入</el-button>
  <div>
    <el-transfer filterable :button-texts="['撤回', '移入']" :filter-method="filterMethod" filter-placeholder="请输入id" :titles="['全选', '全选']" v-model="value" :data="data">
    </el-transfer>
    <el-button @click="del">删除</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: "delLight",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      data: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
    }
  },
  methods: {
    getConfigForm() {
      this.$gAjax(`${this.url}lightAllConf/find/device_list?deviceType=web&time=${Math.random()*100}`)
        .then(res => {
          if (res.resultCode == 'success') {
            if (res.data.length == 0) {
              this.$message({
                type: 'info',
                message: '暂无可用设备'
              });
            }
            let arr = [];
            res.data.forEach((v, i) => {
              arr.push({
                label: `${v.shortAddr}(${v.msg==null?'暂无分组':v.msg})`,
                key: v.shortAddr,
                msg: v.msg || ''
              });
            });
            this.data = [...arr];
            arr = null;
          }
        })
    },
    del() {
      if (this.value.length > 0) {
        let _this = this;
        this.$confirm('此操作将永久删除该灯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let str = _this.value.join('-');
          console.log(str)
          _this.$pAjax(`${_this.url}lightAllConf/del/forever?numbers=${str}`)
            .then(res => {
              if (res.data > 0) {
                _this.value = [];
                _this.getConfigForm();
                _this.$root.Bus.$emit("showLoading", true, '重启中，请稍后');
                _this.initWebpack();
              }
            })
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'info',
          message: '请选择要删除的灯'
        });
      }
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
      console.log(e)
      if (e.data.includes('ws关闭')) {
        this.$root.Bus.$emit("showLoading", false);
      }
    },
    websocketonsend(e) {
      if (this.websock) {
        console.log(this.sendMsg)
        this.websock.send(JSON.stringify({
          'server': 'pro',
          'flag': 2
        }));
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
      if (location.hash == "#/devPageBox/delLight" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
        setTimeout(() => {
          _this.initWebpack();
          _this = null;
        }, 5000)
      }
    },
  },
  mounted() {
    console.log(this.data)
  },
}
</script>

<style lang='scss'>
@import "../../assets/styles/common";
.delLight {
  width: 894px;
  margin: 0 auto;
  text-align: left;
  height: 100%;
  .operateDiv {
    margin-bottom: 20px;
  }
  .el-button+.el-button {
    margin-left: 0px;
  }
  >div {
    height: calc(100% - 60px);
    position: relative;
  }
  .el-transfer {
    +.el-button {
      @include position(absolute, 50%, 0, none, none);
      transform: translateY(-50%);
    }
    height: 100%;
    float: left;
    .el-transfer-panel {
      height: 100%;
      width: 340px;
    }
    .el-transfer-panel__body {
      height: calc(100% - 40px);
      .el-transfer-panel__list.is-filterable {
        height: 100%;
      }
    }
  }
}
</style>
