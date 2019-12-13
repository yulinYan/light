<template>
<div id="mqtt">
  <div style="margin-bottom:20px">
    <el-button type="primary" @click="openSocket">开始</el-button>
    <el-button type="primary" style="margin-left:0" @click="stopSocket">停止</el-button>
  </div>
  <span class="timeChange" v-if="timeChangeT">{{timeChange}}</span>
  <el-tabs v-model="activeTab" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="connectors" name="connectors">
      <ul class="connectorsUL">
        <li v-for="(item,index) in connectorsArr" :key="index">{{item}}</li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="topic" name="topic">
      <el-collapse v-model="activeCollapse" accordion @change="openCollapse">
        <el-collapse-item :title="item[0].Topic" :name="index" v-for="(item, index) in collapseArrEle" :key="index">
          <el-table :data="item" :class="`el-table${index}`" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" max-height="500">
            <el-table-column prop="Msg" label="Msg">
            </el-table-column>
            <el-table-column prop="Count" label="Count">
            </el-table-column>
            <el-table-column prop="Ip" label="Ip">
            </el-table-column>
            <el-table-column prop="LastTime" label="LastTime">
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  name: "mqtt",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      activeTab: 'connectors',
      connectorsArr: [],
      activeCollapse: '',
      websock: null,
      collapseMap: null,
      collapseArrEle: [],
      timeChange: 10,
      timeChangeT: null
    };
  },
  methods: {
    timeChangeFn() {
      this.timeChangeT = setInterval(() => {
        this.timeChange = this.timeChange < 1 ? 10 : --this.timeChange;
      }, 1000)
    },
    openSocket() {
      if (this.activeTab === 'topic') {
        this.timeChange = 10;
        this.timeChangeFn();
      } else {
        if (this.timeChangeT) {
          clearInterval(this.timeChangeT);
          this.timeChangeT = null;
        }
      }
      this.initWebpack();
    },
    stopSocket() {
      if (this.timeChangeT) {
        clearInterval(this.timeChangeT);
        this.timeChangeT = null;
      }
      console.log()
      this.websocketclose();
    },
    handleClick(tab, event) {
      this.activeCollapse = '';
      this.connectorsArr = [];
      this.collapseArrEle = [];
      this.collapseMap.clear();
      this.websocketclose();
      setTimeout(() => {
        if (this.activeTab === 'topic') {
          this.timeChange = 10;
          this.timeChangeFn();
        } else {
          if (this.timeChangeT) {
            clearInterval(this.timeChangeT);
            this.timeChangeT = null;
          }
        }
        this.initWebpack();
      }, 0)
    },
    openCollapse(index) {
      if (index !== '') {
        // let h = (this.collapseArr[index].length + 1) * 52;
        // $(`.el-table${index}`).height(h);
      }
    },
    headerStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
     let style = {
        'background-color': '#f2f4f6',
        'font-size': '16px',
        'color': '#101010',
        'text-align': 'center',
        'height': '60px',
      }
      if (window.innerWidth > 1440) {
        style['height'] = '52px';
        style['font-size'] = '14px';
      } else {
        style['height'] = '20px';
        style['font-size'] = '14px';
      }
      return style;
    },
    cellStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      let style = {
        'text-align': 'center',
        'font-size': '14px',
        'height': '60px',
        'background-color': '#ffffff',
        'color': '#303030',
        // 'border-left': 'solid 1px #d8d8d8',
      }
      if (window.innerWidth > 1660) {
        if (rowIndex % 2 != 0) {
          style['background-color'] = '#f2f4f6';
        }
      } else if (window.innerWidth > 1440) {
        style['height'] = '52px';
        if (rowIndex % 2 != 0) {
          style['background-color'] = '#f2f4f6';
        }
      } else {
        style['height'] = '20px';
        if (rowIndex % 2 != 0) {
          style['background-color'] = '#f2f4f6';
        }
      }
      return style;
    },
    strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k, v] of strMap) {
        obj[k] = v;
      }
      return obj;
    },
    objToStrMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
      }
      return strMap;
    },
    initWebpack() {
      this.websocketclose();
      // console.log(this.websockUrl);
      //初始化websocket
      this.websock = `ws://${this.ipWsMonitor}/${this.activeTab === 'topic'? 'topicback':'connectorsback'}`;
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
      //       console.time();
      // console.timeEnd();
      if (this.activeTab === 'topic') {
        // let l = JSON.parse(e.data),
        //   len = this.collapseArr.length,
        //   flag = false;
        // if (len > 10) {
        //   this.collapseArr.pop();
        // }
        // for (let i = 0; i < len; i++) {
        //   if (this.collapseArr[i].length > 99) {
        //     this.collapseArr[i].pop();
        //   }
        //   if (l.Topic === this.collapseArr[i][0].Topic) {
        //     this.collapseArr[i].unshift(l);
        //     flag = true;
        //     break;
        //   }
        // }
        // if (!flag) {
        //   this.collapseArr.unshift([l]);
        // }
        // console.log(this.collapseArr)
        this.timeChange = 0;
        let l = JSON.parse(e.data),
          msg = this.collapseMap.get(l.Topic),
          len = this.collapseArrEle.length,
          arr = [...this.collapseArrEle];
        if (msg !== undefined) {
          arr[msg].unshift(l);
          arr[msg].length > 20 ? arr[msg].length = 20 : arr[msg].length = arr[msg].length;
        } else {
          this.collapseMap.set(l.Topic, len);
          arr[len] = [l];
        }
        this.collapseArrEle = [...arr];
        arr = null;
        // console.timeEnd();
      } else {
        if (!this.connectorsArr.includes(e.data)) {
          this.connectorsArr.unshift(e.data);
        }
      }
    },
    websocketonsend(e) {
      if (this.websock) {
        // console.log(this.zoneId)
        // this.websock.send(this.sendMsg);
      }
    },
    websocketclose(source) {
      console.log("WebSocket关闭")
      //关闭
      if (this.websock) {
        //   // this.websocketonsend();
        this.websock.close();
        this.websock = null;
      }
    },
    websocketerror(e) {
      //失败
      console.log("WebSocket连接失败");
      let _this = this;
      console.log('----------------------------')
      console.log(e)
      if (location.hash == "#/devPageBox/mqtt" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
        setTimeout(() => {
          _this.initWebpack();
          _this = null;
        }, 5000)
      }
    },
  },
  mounted() {
    this.collapseMap = new Map();
    this.initWebpack();
  },
  destroyed() {
    this.websocketclose('web');
    if (this.timeChangeT) {
      clearInterval(this.timeChangeT);
      this.timeChangeT = null;
    }
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#mqtt {
  position: relative;
  .timeChange {
    @include position(absolute, 4px, 20px, none, none);
    font-size: 16px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 0 20px #ccc;
    border: 1px solid #e0dada;
  }
  .el-tabs__item,
  .el-collapse-item__header {
    font-size: 20px;
  }
  .el-tabs__content {
    padding: 20px;
  }
  .el-tabs__item {
    height: 54px;
    line-height: 50px;
  }
  text-align: left;
  .connectorsUL {
    line-height: 48px;
    li {
      &:first-child {
        border-top: 1px solid #EBEEF5;
      }
      font-size: 20px;
      height: 48px;
      color: #303133;
      border-bottom: 1px solid #EBEEF5;
    }
  }
  .topicMsgDiv {
    font-size: 14px;
    padding: 20px;
  }
}
</style>
