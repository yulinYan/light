<template>
<div id="internet">
  <el-table :data="tableData1" style="width: 100%;margin-bottom: 40px;" :header-cell-style="headerStyle" :cell-style="cellStyle">
    <el-table-column prop="name" label="服务" width="100">
    </el-table-column>
    <el-table-column prop="hck" label="健康" width="100">
      <template slot-scope="scope">
        <span :class="[scope.row.hck === 1?'el-icon-circle-check':'el-icon-circle-close']"></span>
</template>
    </el-table-column>
    <el-table-column prop="time" label="时间" width="180">
<template slot-scope="scope">
<span :class="[scope.row.error?'':'error']">{{scope.row.time}}</span>
</template>
    </el-table-column>
    <el-table-column prop="" label="">
    </el-table-column>
  </el-table>
  <el-table :data="tableData3" style="width: 100%;margin-bottom: 40px;" :header-cell-style="headerStyle" :cell-style="cellStyle">
    <el-table-column prop="name" label="服务" width="100">
    </el-table-column>
    <el-table-column prop="hck" label="健康" width="100">
<template slot-scope="scope">
<span :class="[scope.row.hck === 1?'el-icon-circle-check':'el-icon-circle-close']"></span>
</template>
    </el-table-column>
    <el-table-column prop="time" label="时间" width="180">
<template slot-scope="scope">
<span :class="[scope.row.error?'':'error']">{{scope.row.time}}</span>
</template>
    </el-table-column>
    <el-table-column prop="lightinfoSize" label="灯数量"  width="150">
<template slot-scope="scope">
 {{scope.row.lightinfoSize}}
<span class="el-icon-search" @click="showDetail(scope.row.lightinfo,'lightinfo')"></span>
</template>
    </el-table-column>
    <el-table-column prop="websocketSize" label="webSocket数量"  width="150">
<template slot-scope="scope">
 {{scope.row.websocketSize}}
<span class="el-icon-search" @click="showDetail(scope.row.websocket,'websocket')"></span>
</template>
    </el-table-column>
    <el-table-column prop="" label="">
    </el-table-column>
  </el-table>
  <el-table :data="tableData2" style="width: 100%;" :header-cell-style="headerStyle" :cell-style="cellStyle">
    <el-table-column prop="name" label="服务" width="100">
    </el-table-column>
    <el-table-column prop="hck" label="健康" width="100"><template slot-scope="scope">
<span :class="[scope.row.hck === 1?'el-icon-circle-check':'el-icon-circle-close']"></span>
</template>
    </el-table-column>
    <el-table-column prop="time" label="时间" width="180">
<template slot-scope="scope">
<span :class="[scope.row.error?'':'error']">{{scope.row.time}}</span>
</template>
    </el-table-column>
    <el-table-column prop="crc" label="校验" width="150" style="background:#ccc">
<template slot-scope="scope">
<span :class="[scope.row.crc > 0?'error':'']">{{scope.row.crc}}</span>
</template>
    </el-table-column>
    <el-table-column prop="dural" label="持久化" width="150">
<template slot-scope="scope">
<span :class="[scope.row.dural > 0?'error':'']">{{scope.row.dural}}</span>
</template>
    </el-table-column>
    <el-table-column prop="energy" label="能耗" width="150">
<template slot-scope="scope">
<span :class="[scope.row.energy > 0?'error':'']">{{scope.row.energy}}</span>
</template>
    </el-table-column>
    <el-table-column prop="resolve" label="解析">
<template slot-scope="scope">
<span :class="[scope.row.resolve > 0?'error':'']">{{scope.row.resolve}}</span>
</template>
    </el-table-column>
  </el-table>
<el-dialog
  title="详情"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
  <div class="search"><el-input v-model="search" size="mini" :placeholder="showTable==='lightinfo'?'搜索短地址':'搜索ip'"/></div>
        <el-table  v-if="showTable==='lightinfo'" key="lightinfo" max-height="400" :data="tableData.filter(data => !search || data.shortAddr.includes(search))" stripe style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle">
        <el-table-column prop="gmtCreate" label="初次连接" width="80">
<template slot-scope="scope">
 {{scope.row.gmtCreate.split(' ')[0]}}<br/>{{scope.row.gmtCreate.split(' ')[1]}}
</template>
        </el-table-column>
        <el-table-column prop="shortAddr" label="短地址" width="150">
        </el-table-column>
        <el-table-column prop="indBright" label="感应亮度">
        </el-table-column>
        <el-table-column prop="unindBright" label="未感应亮度">
        </el-table-column>
        <el-table-column prop="indTime" label="感应时间">
        </el-table-column>
    </el-table>
        <el-table v-else-if="showTable==='websocket'" key="websocket" max-height="400" :data="tableData.filter(data => !search || data.ip.includes(search))" stripe style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle">
        <el-table-column prop="CF" label="确认">
<template slot-scope="scope">
<span :class="[scope.row.CF === 1?'el-icon-circle-check':'el-icon-circle-close']"></span>
</template>
        </el-table-column>
        <el-table-column prop="QY" label="区域">
        </el-table-column>
        <el-table-column prop="TK" label="时间" width="80">
        </el-table-column>
        <el-table-column prop="TP" label="当前模块">
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型">
        </el-table-column>
        <el-table-column prop="ip" label="ip" width="100">
        </el-table-column>
    </el-table>
</el-dialog>
</div>
</template>

<script>
import {
  netstats
} from '../../apis/devPage/internet.js'
import {
  switchFn
} from '../../apis/LightCtrl.js';
export default {
  name: "internet",
  data() {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      centerDialogVisible: false,
      tableData: [],
      search: '',
      showTable: ''
    };
  },
  methods: {
    showDetail(arr, t) {
      let msg = JSON.parse(JSON.stringify(arr));
      this.showTable = t;
      console.log(this.showTable)
      this.centerDialogVisible = true;
      if (t === 'lightinfo') {
        msg.forEach((v, i) => {
          v.gmtCreate = this.$moment(v.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        msg.forEach((v, i) => {
          v.deviceType = v.deviceType === 1 ? 'pc' : 'android';
          v.TK = this.$moment(v.TK).format('YYYY-MM-DD HH:mm:ss')
          switch (v.TP) {
            case 0:
              v.TP = '基本控制';
              break;
            case 1:
              v.TP = '人感控制';
              break;
            case 2:
              v.TP = '能源管理';
              break;
          }
        })
      }
      this.tableData = [...msg];
      msg = null;
    },
    getNetstats() {
      netstats().then(res => {
        setTimeout(() => {
          this.getNetstats();
        }, 60000)
        let tableData1 = [],
          nowTime = new Date().valueOf();
        for (let k in res) {
          let v = JSON.parse(res[k]);
          // console.log(v)
          if (k === 'mgo' || k === 'redis' || k === 'mysql') {
            tableData1.push({
              name: k,
              hck: v.hck,
              time: this.$moment(Number(v.time + '000')).format('YYYY-MM-DD HH:mm:ss'),
              error: nowTime - Number(v.time + '000') > 3 ? true : false
            })
          } else if (k === 'pro') {
            this.tableData2 = [{
              name: k,
              hck: v.hck,
              time: this.$moment(Number(v.time + '000')).format('YYYY-MM-DD HH:mm:ss'),
              crc: v.crc,
              dural: v.dural,
              energy: v.energy,
              resolve: v.resolve,
              error: nowTime - Number(v.time + '000') > 3 ? true : false
            }]
          } else if (k === 'cus') {
            this.tableData3 = [{
              name: k,
              hck: v.hck,
              time: this.$moment(Number(v.time + '000')).format('YYYY-MM-DD HH:mm:ss'),
              lightinfoSize: v.lightinfoSize,
              websocketSize: v.websocketSize,
              error: nowTime - Number(v.time + '000') > 3 ? true : false,
              lightinfo: v.lightinfo,
              websocket: v.websocket
            }]
          }
        }
        this.tableData1 = [...tableData1];
      }).catch(() => {});
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
      } else {
        style['height'] = '52px';
        if (rowIndex % 2 != 0) {
          style['background-color'] = '#f2f4f6';
        }
      }
      return style;
    },
  },
  mounted() {
    this.getNetstats();
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#internet {
  div.el-dialog {
    width: 658px !important;
  }
  .el-icon-circle-check {
    color: #67C23A;
    font-size: 20px;
  }
  .el-icon-search {
    cursor: pointer;
  }
  .el-icon-circle-close {
    color: #F56C6C;
    font-size: 20px;
  }
  .error {
    background: #F56C6C;
    color: #fff;
    display: block;
    width: 100%;
    height: 100%;
  }
  .el-table td {
    padding: 0;
  }
  .el-table .cell {
    // line-height: 52px;
    padding: 0;
  }
  .search {
    margin-bottom: 10px;
    .el-input {
      width: 200px;
    }
    .el-input__inner {
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
    }
    button {
      width: 80px;
      height: 30px;
      border-radius: 4px;
      background: #3c70d7;
      color: #fff;
      margin-left: 20px;
    }
  }
}
</style>
