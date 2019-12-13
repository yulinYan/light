<template>
<!-- 后台隐藏页面 -->
<div class="lightConfig">
  <el-card class="box-card cardOne">
    <div slot="header" class="clearfix">
      <span>模块1</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div class="cardBody">
      <el-table :data="table1" style="width: 100%;float:left" :height="cardHeight">
        <el-table-column prop="shortAddr" label="id(所有)">
          <template slot-scope="scope">
<span :title="scope.row.shortAddr">{{scope.row.shortAddr}}</span>
</template>
        </el-table-column>
        <el-table-column prop="isExits" label="id(已配灯)" >
<template slot-scope="scope">
<img v-if="scope.row.isExits==1&&scope.row.signalCount==0" title='离线' :src="grayLight" alt="" style="width:20px">
<img v-if="scope.row.isExits==1&&scope.row.signalCount>0" title='已配在线' :src="blueLight" alt="" style="width:20px">
<img v-if="scope.row.isExits==-2" :src="redLight" alt="" title='已配离线' style="width:20px">
<!-- <span :title="scope.row.isExits==1?'是':'否'">{{scope.row.isExits==1?'是':'否'}}</span> -->
</template>
        </el-table-column>
                <el-table-column prop="signalCount" label="状态" min-width="124">
<template slot-scope="scope" slot="header">
<!-- <div class="tableHeader">
  状态(<span class="blue" title="已配在线"></span><span class="red" title="已配离线"></span><span class="yellow" title="未配在线"></span><span class="gray" title="离线"></span><span class="grayDeep" title="未配从未在线"></span><span class="block" title="系统故障"></span>)
</div> -->
<span v-popover:popover1 style="font-weight: bold;">状态</span>
<el-popover :visible-arrow="false" ref="popover1" placement="top-start" width="200" trigger="hover">
  <div class="tableHeader">
    <span class="blue" title="已配在线"></span>->已配在线<br/>
    <span class="red" title="已配离线"></span>->已配从未在线<br/>
    <span class="yellow" title="未配在线"></span>->未配在线<br/>
    <span class="gray" title="离线"></span>->离线(已配、未配)<br/>
    <span class="grayDeep" title="未配从未在线"></span>->未配从未在线<br/>
    <span class="block" title="系统故障"></span>->系统故障
  </div>
</el-popover>
</template>

<template slot-scope="scope">
<div class="table1OneBoxClass">
  <!-- ({{scope.row.signalCount}}) -->
  <span v-if="scope.row.isExits>0" v-for="i in 5" :class="[scope.row.signalCount >= i ? 'hasAnimate' : '']"></span>
  <span v-if="scope.row.isExits==0" v-for="i in 5" :class="[scope.row.signalCount >= i ? 'hasAnimate' : '']"></span>
  <span v-if="scope.row.isExits<0" v-for="i in 5" class="hasAnimate"></span>
  <!-- <span v-for="i in 5" class='hasAnimate'></span> -->
</div>
</template>
        </el-table-column>
      </el-table>
      <!-- <el-table :data="wifi" stripe style="width: 49%;float:right" :height="cardHeight">
        <el-table-column prop="addr" label="id(已配灯)">
<template slot-scope="scope">
<span :title="scope.row.addr">{{scope.row.addr}}</span>
</template>
        </el-table-column>
        <el-table-column prop="size" label="状态" width="124">
<template slot-scope="scope">
<el-rate v-model="scope.row.size" disabled disabled-void-color='#ccc' :colors="scope.row.color">
</el-rate>
</template>
        </el-table-column>
        <el-table-column prop="addr" label="id(所有)">
<template slot-scope="scope">
<span :title="scope.row.addr">{{scope.row.addr}}</span>
</template>
        </el-table-column>
      </el-table> -->
    </div>
  </el-card>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>模块2</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div class="cardBody">
 <el-table :data="table2" style="width: 100%" :height="cardHeight" :row-class-name="table2RowClassName">
        <el-table-column prop="shorAddr" label="id" width="80">
<template slot-scope="scope">
<span :title="scope.row.shorAddr">{{scope.row.shorAddr}}</span>
</template>
        </el-table-column>
        <el-table-column prop="order" label="命令">
<template slot-scope="scope">
<span :title="scope.row.order">{{scope.row.order}}</span>
</template>
        </el-table-column>
        <el-table-column prop="nowTime" label="时间" width="150">
<template slot-scope="scope">
<span :title="scope.row.nowTime">{{scope.row.nowTime.split(' ')[0]}}<br/>{{scope.row.nowTime.split(' ')[1]}}</span>
</template>
        </el-table-column>
        <el-table-column prop="" label="解析">
<template slot-scope="scope">
<span :title="scope.row.resultOrder.partAddrNumber">pN:{{scope.row.resultOrder.partAddrNumber}}</span>
<br/>
<span :title="scope.row.resultOrder.EVPP">EVPP:{{scope.row.resultOrder.EVPP}}</span><br/>
<span :title="scope.row.resultOrder.source">source:{{scope.row.resultOrder.source}}</span>
</template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>模块3</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div class="cardBody">
      <el-table :data="table3"  style="width: 100%;float:right" :height="cardHeight" :row-class-name="table3RowClassName">
         <el-table-column prop="zone" label="厂区">
<template slot-scope="scope">
<span :title="scope.row.zone">{{scope.row.zone}}</span>
</template>
        </el-table-column>
        <el-table-column prop="shortAddr" label="id/段号地址号">
<template slot-scope="scope">
<span :title="`${scope.row.shortAddr}/${scope.row.partAndAddrNum}`">{{scope.row.shortAddr}}/{{scope.row.partAndAddrNum}}</span>
</template>
        </el-table-column>
        <el-table-column prop="repeat" label="是否重复">
<template slot-scope="scope">
<img v-if="!scope.row.repeat" title="否" :src="clash" alt="">
<!-- <span :title="scope.row.repeat?'是':'否'">{{scope.row.repeat?'是':'否'}}</span> -->
</template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>模块4</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div class="cardBody">
       <el-table :data="table4" style="width: 100%;float:right" :height="cardHeight">
        <el-table-column prop="shortAddr" label="id">
<template slot-scope="scope">
<span :title="scope.row.shortAddr">{{scope.row.shortAddr}}</span>
</template>
        </el-table-column>
        <el-table-column prop="source" label="高通列表">
<template slot-scope="scope">
<span :title="scope.row.source">{{scope.row.source}}</span>
</template>
        </el-table-column>
        <el-table-column prop="timestamp" label="时间"><template slot-scope="scope">
<span :title="scope.row.timestamp">{{scope.row.timestamp}}</span>
</template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </el-card>

</div>
</template>

<script>
import {
  setInterval,
  setTimeout,
  clearTimeout
} from 'timers';
import grayLight from './assets/img/LightConfig/grayLight.png';
import blueLight from './assets/img/LightConfig/blueLight.png';
import redLight from './assets/img/LightConfig/redLight.png';
import clash from './assets/img/LightConfig/clash.png';
// import grayStar from './assets/img/LightConfig/gray.png';
export default {
  name: "LightConfig",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      grayLight: grayLight,
      blueLight: blueLight,
      redLight: redLight,
      clash: clash,
      // grayStar: grayStar,
      cardHeight: '100%',
      wifi: [],
      activeClass: 'activeSpan',
      table1: [],
      table2: [],
      table3: [],
      table4: [],
      time1: null,
      time2: null,
      time3: null,
      time4: null,
    };
  },
  methods: {
    setTable1() {
      for (let j = 0; j < $('.table1OneBoxClass').length; j++) {
        if (this.table1[j].color == 'blue' || this.table1[j].color == 'yellow') {
          for (let i = 0; i < $($('.table1OneBoxClass')[j]).children('span.hasAnimate').length; i++) {
            setTimeout(() => {
              $($($('.table1OneBoxClass')[j]).children('span.hasAnimate')[i]).addClass(this.table1[j].color);
            }, 1000 * i)
          }
        } else {
          $($($('.table1OneBoxClass')[j]).children('span.hasAnimate')).addClass(this.table1[j].color);
        }
      }
    },
    getTable1() {
      $('span.hasAnimate').removeClass().addClass('hasAnimate');
      this.$gAjax(`${this.url}monitor/lightSignalInfo`)
        .then(res => {
          if (res.resultCode == 'success') {
            let arr = [];
            res.data.forEach((v, i) => {
              if (v.isExits == -2) {
                v.color = 'red'; //配过但从未在线
              } else if (v.isExits == -3) {
                v.color = 'block'; //系统崩溃
              } else if (v.isExits == -1) {
                v.color = 'grayDeep'; //没配过但从未在线
              } else if (v.isExits == 1) { //配过
                if (v.signalCount >= 1) {
                  v.color = 'blue'; //在线
                } else {
                  v.color = 'gray'; //离线
                }
              } else if (v.isExits == 0) { //没配过
                if (v.signalCount >= 1) {
                  v.color = 'yellow'; //在线
                } else {
                  v.color = 'gray'; //离线
                }
              }
              arr.push(v);
            })
            this.table1 = [...arr];
            arr = null;
            this.$nextTick(function() {
              this.setTable1();
            })
            this.time1 = setTimeout(() => {
              clearTimeout(this.time1);
              this.time1 = null;
              this.getTable1();
            }, 5000)
          }
        })
    },
    table2RowClassName({
      row,
      rowIndex
    }) {
      if (row.state != 1) {
        return 'warning-row';
      } else {
        return '';
      }
    },
    table3RowClassName({
      row,
      rowIndex
    }) {
      if (row.repeat) {
        return 'warning-row';
      } else {
        return '';
      }
    },
    getTable2() {
      this.$gAjax(`${this.url}monitor/lightMonitorDetailsInfo`)
        .then(res => {
          if (res.resultCode == 'success') {
            let arr = []
            res.data.forEach((v, i) => {
              v.nowTime = this.$moment(Number(v.nowTime)).format("YYYY-MM-DD HH:mm:ss");
              arr.push(v);
            })
            this.table2 = [...arr];
            arr = null;
            this.time2 = setTimeout(() => {
              clearTimeout(this.time2);
              this.time2 = null;
              this.getTable2();
            }, 2500)
          }
        })
    },
    getTable3() {
      this.$gAjax(`${this.url}monitor/zone`)
        .then(res => {
          if (res.resultCode == 'success') {
            this.table3 = res.data;
            this.time3 = setTimeout(() => {
              clearTimeout(this.time3);
              this.time3 = null;
              this.getTable3();
            }, 2500)
          }
        })
    },
    getTable4() {
      this.$gAjax(`${this.url}monitor/source`)
        .then(res => {
          if (res.resultCode == 'success') {
            let arr = [];
            res.data.forEach((v, i) => {
              v.timestamp = this.$moment(v.timestamp).format("YYYY-MM-DD HH:mm:ss");
              arr.push(v);
            })
            this.table4 = [...arr];
            arr = null;
            this.time4 = setTimeout(() => {
              clearTimeout(this.time4);
              this.time4 = null;
              this.getTable4();
            }, 2500)
          }
        })
    },
  },
  mounted() {
    // console.log($('.cardBody').height())
    this.cardHeight = $('.cardBody').height();
    this.getTable1();
    this.getTable2();
    this.getTable3();
    this.getTable4();
  },
  updated() {

  },
  destroyed() {
    if (this.time1 != null) {
      clearTimeout(this.time1);
      this.time1 = null;
    }
    if (this.time2 != null) {
      clearTimeout(this.time2);
      this.time2 = null;
    }
    if (this.time3 != null) {
      clearTimeout(this.time3);
      this.time3 = null;
    }
    if (this.time4 != null) {
      clearTimeout(this.time4);
      this.time4 = null;
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss' scope>
@import "./assets/styles/common";
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #EBEEF5;
}


.lightConfig {
  padding: 20px;
  padding-bottom: 0;
  height: 100%;
  .box-card {
    width: calc(50% - 10px);
    height: calc(50% - 20px);
    float: left;
    margin-bottom: 20px;
    &:nth-of-type(2n) {
      margin-left: 20px;
    }
  }
  .el-card__header span {
    font-size: 16px;
    padding: 16px 20px;
  }
  .el-card__body {
    // overflow-y: auto;
    height: calc(100% - 53px);
    padding: 0px 20px 10px;
    .cardBody {
      height: 100%;
    }
  }
  .cell {
    display: inline-block;
    @include text-overflow;
  }
  .warning-row {
    background-color: #E43E3E;
  }
}

.table1OneBoxClass span,
.tableHeader span {
  display: inline-block;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  background-color: #C3C3C3;
  vertical-align: sub;
  &.blue {
    background-color: #3BD879;
  }
  &.red {
    background-color: #E43E3E;
  }
  &.grayDeep {
    background-color: #7F7F7F;
  }
  &.gray {
    background-color: #C3C3C3;
  }
  &.yellow {
    background-color: #F9CC9D;
  }
  &.block {
    background-color: #000;
  }
}
</style>
