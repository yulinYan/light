<template>
<!-- 首页 -->
<div class="LightOverview">
  <ul class="msg">
    <li v-for="(item,index) in msg" :key="index">
      <img class="arror" v-if="(index===0||index===1)&&item.arrow === 'down'" src="./assets/img/LightOverview/down.png" alt="" style="cursor:pointer" :title="`${index===0?'今日比昨日降低':'本周比上周降低'}`">
      <img class="arror" v-else-if="(index===0||index===1)&&item.arrow === 'up'" src="./assets/img/LightOverview/up.png" alt="" style="cursor:pointer" :title="`${index===0?'今日比昨日升高':'本周比上周升高'}`">
      <p>
        <img :src="require(`./assets/img/LightOverview/${item.img}.png`)" alt=""><br/> {{item.name}}
      </p>
      <div v-if="index==2">
        {{item.num.split('/')[0]}}<i>/</i><span>{{item.unit}}</span>
      </div>
      <div v-else-if="index!=3" :style="{color:(index===0||index===1)?item.arrow === 'up'?'#ec5555':'#68c161':'#303030'}">
        {{item.num}}<span>{{item.unit}}</span>
      </div>
      <div v-else>
        {{elapsedTime.elapsedDay}}<span>天</span>{{elapsedTime.elapsedHour}}<span>时</span>{{elapsedTime.elapsedMin}}<span>分</span>
      </div>
      <span>{{item.detailed}}</span>
    </li>
  </ul>
  <div>
    <div class="overview">
      <p class="header"><span>节能对比</span></p>
      <div id="energyCompared">
      </div>
    </div>
    <div class="overview3">
      <div class="overview" style="padding-right: 25px;">
        <p class="header">
          <span>当天能耗</span>
        </p>
        <div id="energyDay"></div>
      </div>
      <div class="overview">
        <p class="header">
          <span>本周能耗</span>
        </p>
        <div id="energyWeek"></div>
      </div>
      <div class="overview">
        <p class="header">
          <span>策略执行情况及预告</span>
        </p>
        <div id="strategy">
          <el-table :data="strategyArr" stripe style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle" :height="tableHeight">
            <el-table-column prop="name" label="名称">
              <template slot-scope="scope">
                <span style="cursor:pointer" :title="'名称：'+scope.row.name+'，区域：'+scope.row.category+'，分组：'+scope.row.zone">{{scope.row.name}}</span>
</template>
            </el-table-column>
            <el-table-column prop="time" label="任务">
<template slot-scope="scope">
<span style="cursor:pointer" :title="'日期：'+scope.row.date">{{scope.row.time}}</span>
<br/>{{scope.row.operate}}
</template>
            </el-table-column>
            <el-table-column prop="finished" label="执行状态" min-width="80">
<template slot-scope="scope">
<span :style="{color:scope.row.finished==='yes'?'#25a566':'#f6be44'}">{{scope.row.finished==='yes'?'已执行':'未执行'}}</span>
</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import echarts from 'echarts';
// 接口
import {
  getHomeTop,
  compNowAndBefore,
  analyse,
  week,
  strategy
} from './apis/LightOverview.js';
export default {
  name: "LightOverview",
  data() {
    return {
      websock: null,
      elapsedTime: {
        elapsedDay: '0',
        elapsedHour: '0',
        elapsedMin: '0',
      },
      msg: [{
        'name': "今日能耗",
        'num': 0,
        'unit': 'kW·h',
        'detailed': '昨日能耗：0kW·h',
        'arrow': 'down',
        'img': 'gonglv'
      }, {
        'name': "本周能耗",
        'num': 0,
        'unit': 'kW·h',
        'detailed': '上周能耗：0kW·h',
        'arrow': 'down',
        'img': 'nenghao'
      }, {
        'name': "设备运行",
        'num': '0/0',
        'unit': '0',
        'detailed': '开灯/总数',
        'img': 'shebei'
      }, {
        'name': "运行时间",
        'num': 0,
        'unit': '',
        'detailed': '累计稳定服务时长',
        'img': 'time'
      }],
      option: {
        color: ['#3c70d7', '#7ea6f2', '#D4E8FF', '#7DE5D2', '#FEAE7B', '#003399', '#3366cc', '#0087cb', '#3399ff', '#017890', '#587498', '#74828f', '#666633', '#99cccc', '#a1bad0', '#c25b56', '#ff9933', '#d0a727', '#f9ca79', '#d9ccb9'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(240, 244, 251, 0.8)',
          textStyle: {
            color: '#505050',
            fontFamily: 'Microsoft YaHei',
            align: 'left'
          },
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          type: 'scroll',
          width: '70%',
          data: [],
          icon: 'pin',
          textStyle: {
            fontSize: '14px',
            fontFamily: 'Microsoft YaHei',
          },
          itemGap: 30,
          right: 10,
          top: '10px',
        },
        grid: {
          left: '40px',
          right: '26px',
          bottom: '40px',
          top: '50px'
        },
        dataset: {
          // 提供一份数据。
          source: []
        },
        xAxis: {
          type: 'category',
          nameGap: 10,
          // data: [],
          boundaryGap: false,
          axisLabel: {
            color: '#505050'
          },
          axisTick: {
            show: false,
            alignWithLabel: false
          },
          name: ''
        },
        yAxis: {
          name: '',
          nameTextStyle: {
            // align: 'left',
            fontFamily: 'Microsoft YaHei',
            align: 'right'
          },
          type: 'value',
          nameGap: 20,
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#505050',
            margin: 40,
            align: 'left'
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#eee'
            }
          }
        },
        series: [],
      },
      destroyFlag: false, //切换页面清除定时器
      energyCompared: null, //节能对比
      get24HourCharts: null,
      destroyFlag24Hour: false, //当天能耗清除定时器
      // energyAllWeek: '',
      energyWeek: null,
      destroyFlagStrategy: false, //当天能耗清除定时器
      strategyArr: [],
      tableHeight: 0
    };
  },
  methods: {
    //运行时间
    getTime(time) {
      if (time == null || time < 0) {
        return;
      }
      var StatusMinute = time / 1000 / 60;
      var day = parseInt(StatusMinute / 60 / 24);
      var hour = parseInt(StatusMinute / 60 % 24);
      var min = parseInt(StatusMinute % 60);
      if (day > 0) {
        this.elapsedTime.elapsedDay = day;
      }
      if (hour > 0) {
        this.elapsedTime.elapsedHour = hour;
      }
      if (min > 0) {
        this.elapsedTime.elapsedMin = parseFloat(min);
      }
    },
    getElapsedTime() {
      if (!this.destroyFlag) {
        getHomeTop()
          .then(res => {
            if (res.resultCode == 'success') {
              let _this = this;
              this.getTime(res.data.total.totleTime || null);
              this.time = setTimeout(() => {
                // console.log(_this.destroyFlag)
                if (_this.destroyFlag) {
                  clearTimeout(_this.time);
                  _this.time = null;
                  return;
                } else {
                  _this.getElapsedTime();
                }
              }, 60000)
              let [todayW = 0, weekW = 0, runTotalCounts = '0/0', elapsedTime = ''] = [Math.ceil(res.data.todayW * 1000) / 1000, Math.ceil(res.data.weekW * 1000) / 1000, res.data.runTotalCounts, 0];
              runTotalCounts = runTotalCounts == '' ? '0/0' : runTotalCounts;
              let arr = [todayW, weekW, runTotalCounts, elapsedTime];
              this.msg.forEach((v, i) => {
                v.num = arr[i];
                if (i === 2) {
                  v.unit = runTotalCounts.split('/')[1]
                } else if (i === 0) {
                  v.detailed = `昨日能耗：${Math.ceil(res.data.beforeW * 1000) / 1000}kW·h`
                } else if (i === 1) {
                  v.detailed = `上周能耗：${Math.ceil(res.data.beforeWeekW * 1000) / 1000}kW·h`
                }
              })
              this.msg[0].arrow = res.data.todayW > res.data.beforeW ? 'up' : 'down';
              this.msg[1].arrow = res.data.weekW > res.data.beforeWeekW ? 'up' : 'down';
              arr = null;
              // console.log(this.msg)
            }
          })
      }
    },
    // 节能对比
    getEnergyCompared() {
      if (!this.destroyFlag) {
        compNowAndBefore()
          .then(res => {
            if (res.resultCode == 'success') {
              if (!this.destroyFlag) {
                setTimeout(() => {
                  this.getEnergyCompared();
                }, 60000)
              }
              this.energyCompared && this.energyCompared.clear();
              this.option.xAxis.boundaryGap = false;
              this.option.dataset = {};
              this.option.xAxis.name = 'h';
              this.option.xAxis.data = Object.keys(res.data.todayResult);
              this.option.yAxis.max = null;
              this.option.yAxis.name = 'kW            ';
              this.option.legend.data = ['基线', '今天', '昨天'];
              this.option.tooltip.formatter = null;
              this.option.series = [{
                  name: '今天',
                  type: 'line',
                  areaStyle: {
                    color: 'rgba(60,126,215,0.6)'
                  },
                  symbol: 'none',
                  itemStyle: {
                    normal: {
                      color: '#3c7ed7'
                    }
                  },
                  data: Object.values(res.data.todayResult)
                },
                {
                  name: '昨天',
                  type: 'line',
                  areaStyle: {
                    color: '#d8e5f7'
                  },
                  symbol: 'none',
                  itemStyle: {
                    normal: {
                      color: '#d8e5f7'
                    }
                  },
                  lineStyle: {
                    width: 0
                  },
                  data: Object.values(res.data.beforeResult)
                },
              ];
              this.energyCompared && this.energyCompared.setOption(this.option);
              this.resizegetEnergyCompared();
              window.addEventListener("resize", this.resizegetEnergyCompared);
            }
          })
      }
    },
    // 当天能耗
    get24Hour() {
      if (!this.destroyFlag24Hour) {
        // 基于准备好的dom，初始化echarts实例
        analyse()
          .then(res => {
            if (res.resultCode == 'success') {
              if (!this.destroyFlag) {
                setTimeout(() => {
                  this.get24Hour();
                }, 60000)
              }
              // this.get24HourCharts.hideLoading();
              this.get24HourCharts && this.get24HourCharts.clear();
              this.option.yAxis.max = null;
              this.option.yAxis.name = 'kW·h          ';
              this.option.xAxis.name = 'h';
              this.option.xAxis.boundaryGap = false;
              this.option.xAxis.data = null;
              this.option.tooltip.formatter = null;
              this.option.legend.data = [];
              this.option.series = [];
              this.option.dataset.source = [
                ['']
              ];
              // 绘制图表
              let arr = [];
              for (let i in res.data) {
                this.option.dataset.source[0].push(i);
                this.option.legend.data.push({
                  name: i
                })
                this.option.series.push({
                  type: 'line',
                  smooth: true,
                  // showSymbol: false,
                  animationDuration: 2000,
                  animationDelayUpdate: function(idx) {
                    return idx * 5;
                  }
                });
              }
              Object.values(res.data).forEach((v, i) => {
                //后台给什么就显示什么
                v.forEach((vI, vV) => {
                  if (!Array.isArray(arr[vV])) {
                    arr[vV] = [];
                  }
                  arr[vV][i] = Math.ceil(vI * 1000) / 1000;
                })
              })
              arr.forEach((v, i) => {
                this.option.dataset.source.push([i, ...v]);
              })
              this.get24HourCharts.setOption(this.option);
              window.addEventListener("resize", this.resizeGet24HourCharts);
            } else {
              this.option.xAxis.data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
              this.option.legend.data = [];
              this.option.series = [];
              this.get24HourCharts.setOption(this.option);
            }
          })
      }
    },
    timeToWeek(day) {
      switch (this.$moment(day).format('d')) {
        case '0':
          day = "周日";
          break;
        case '1':
          day = "周一";
          break;
        case '2':
          day = "周二";
          break;
        case '3':
          day = "周三";
          break;
        case '4':
          day = "周四";
          break;
        case '5':
          day = "周五";
          break;
        case '6':
          day = "周六";
          break;
      }
      return day;
    },
    // 本周能耗
    getEnergyWeek() {
      if (!this.destroyFlag) {
        week()
          .then(res => {
            if (res.resultCode == 'success') {
              if (!this.destroyFlag) {
                setTimeout(() => {
                  this.getEnergyWeek();
                }, 60000)
              }
              this.energyWeek && this.energyWeek.clear();
              this.option.legend.data = [];
              this.option.xAxis.data = null;
              this.option.xAxis.boundaryGap = true;
              this.option.xAxis.name = '';
              this.option.yAxis.name = 'kW·h          ';
              let source = [],
                legend = [];
              for (let i = res.data.length - 1; i >= 0; i--) {
                let len = source.findIndex(t => t.energy === this.timeToWeek(res.data[i].dateTime));
                legend.push(res.data[i].areaName)
                if (len === -1) {
                  source.push({
                    energy: this.timeToWeek(res.data[i].dateTime),
                    [res.data[i].areaName]: res.data[i].energy
                  });
                } else {
                  source[len][res.data[i].areaName] = res.data[i].energy;
                }
              }
              this.option.legend.data = Array.from(new Set(legend));
              this.option.dataset = {
                dimensions: ['energy', ...this.option.legend.data],
                source: source
              };
              // let data = res.data.map(item => item.energy);
              // let maxY = 0;
              // data.forEach((v, i) => {
              //   maxY = maxY < Math.ceil(v) ? (Math.ceil(v) + 10) : maxY;
              // })
              // let dataShadow = new Array(7);
              // dataShadow.fill(maxY);

              // this.option.yAxis.max = maxY;
              let series = new Array(this.option.dataset.dimensions.length - 1);
              series.fill({
                seriesLayoutBy: 'row',
                type: 'bar',
                stack: 'energy',
                barGap: '30%',
                barMaxWidth: '18',
                itemStyle: {
                  emphasis: {
                    shadowBlur: 2,
                    opacity: 1
                  },
                  normal: {
                    barBorderRadius: [4, 4, 0, 0]
                  }
                },
              })
              this.option.series = series;
              console.log(this.option)
              this.energyWeek && this.energyWeek.setOption(this.option);
              window.addEventListener("resize", this.resizeGetenergyWeek);
            }
          })
      }
    },
    //策略执行情况及预告
    getStrategyArr() {
      if (!this.destroyFlagStrategy) {
        strategy()
          .then(res => {
            if (res.resultCode == 'success') {
              if (!this.destroyFlagStrategy) {
                setTimeout(() => {
                  this.getStrategyArr();
                }, 60000)
              }
              if (!res.data || res.data.length === 0) {
                this.strategyArr = ['当前没有任何定时策略，请设置！'];
              }
              this.strategyArr = res.data;
            }
          })
      }

    },
    // 改变表格样式
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
    // 适配
    resizeGet24HourCharts() {
      setTimeout(() => {
        if (this.get24HourCharts) {
          this.get24HourCharts.resize();
        }
      }, 0)
    },
    resizegetEnergyCompared() {
      setTimeout(() => {
        if (this.energyCompared) {
          this.energyCompared.resize();
        }
      }, 0)
    },
    resizeGetenergyWeek() {
      setTimeout(() => {
        this.energyWeek.resize();
      }, 0)
    },
  },
  mounted() {
    this.getElapsedTime();
    this.energyCompared = echarts.init(document.getElementById('energyCompared'));
    this.getEnergyCompared();
    this.get24HourCharts = echarts.init(document.getElementById('energyDay'));
    this.get24Hour();
    this.energyWeek = echarts.init(document.getElementById('energyWeek'));
    this.getEnergyWeek();
    this.$nextTick(() => {
      this.tableHeight = $('#strategy').height() - 0;
    })
    window.addEventListener('resize', () => {
      this.tableHeight = $('#strategy').height() - 0;
    })
    this.getStrategyArr();
  },
  destroyed() {
    window.removeEventListener("resize", this.resizegetEnergyCompared);
    window.removeEventListener("resize", this.resizeGet24HourCharts);
    window.removeEventListener("resize", this.resizeGetenergyWeek);
    this.energyCompared.clear();
    this.energyCompared = null;
    this.get24HourCharts.clear();
    this.get24HourCharts = null;
    this.destroyFlag = true;
    this.destroyFlag24Hour = true;
    this.destroyFlagStrategy = true;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.LightOverview {
  width: 100%;
  .el-table td {
    padding: 2px 0;
  }
  .msg {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    @include media($m1366) {
      margin-bottom: 15px;
    }
    height: 300px;
    @include media($h720) {
      height: 250px;
    }
    position: relative;
    li {
      &:hover {
        box-shadow: 0px 15px 25px 0px rgba(49, 59, 87, 0.12);
      }
      width: calc( 100% / 4);
      &:nth-of-type(2) {
        margin: 0 15px 0 30px;
        @include media($m1366) {
          margin: 0 7.5px 0 15px;
        }
      }
      &:nth-of-type(3) {
        margin: 0 30px 0 15px;
        @include media($m1366) {
          margin: 0 15px 0 7.5px;
        }
      }
      position: relative;
      background-color: #ffffff;
      border-radius: 8px;
      opacity: 0;
      animation: liShow 0.2s ease-in-out forwards;
      .arror {
        @include position(absolute, 23px, 42px, none, none);
      }
      p {
        font-weight: bold;
        font-size: 16px;
        color: #424956;
        z-index: 2;
        margin: 40px 0;
        @include media($h720) {
          margin: 28px 0 26px;
        }
        img {
          margin-bottom: 10px;
        }
      }
      &:nth-of-type(3) {
        i {
          font-style: normal;
          margin-left: 4px;
          color: #303030;
        }
      }
      div {
        font-size: 50px;
        @include media($h720) {
          font-size: 40px;
        }
        @include media($m1440) {
          font-size: 40px;
        }
        font-family: GrayDesignMedium !important;
        span {
          font-size: 16px;
          margin: 0 8px;
          color: #303030;
        }
      }
      >span {
        font-size: 14px;
        color: #747f8b;
        white-space: nowrap;
        @include position(absolute, none, none, 30px, 50%);
        transform: translateX(-50%);
      }
    }
  }
  .overview {
    #energyCompared {
      height: 257px;
      @include media($h720) {
        height: 207px;
      }
      width: 100%;
    }
    #energyDay,
    #energyWeek,
    #strategy {
      height: 317px;
      overflow: hidden;
      @include media($h720) {
        height: 267px;
      }
      width: 100%;
    }
  }
  .overview3 {
    margin-top: 30px;
    @include media($m1366) {
      margin-top: 15px;
    }
    display: flex;
    justify-content: space-between;
    .overview {
      width: calc(100% / 3);
      height: 100%;
      margin-top: 0;
    }
    .overview:nth-of-type(2) {
      margin: 0 30px;
      @include media($m1366) {
        margin: 0 15px;
      }
    }
  }
  #strategy {
    text-align: left;
    overflow: auto;
    padding: 15px 0;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
    .cell {
      padding: 0;
    }
    tr:nth-of-type(2) .cell span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  @keyframes liShow {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
