<template>
<!-- 能源统计 -->
<div class="LightStatistics">
  <div class="overview" v-if="show.area">
    <p class="header">
      <span>区域表单</span>
    </p>
    <div>
      <el-table :data="tableData" stripe style="width: 100%;padding:30px 0" :cell-style="cellStyleReport" :header-cell-style="headerStyleReport">
        <el-table-column prop="areaName" label="区域名称">
        </el-table-column>
        <el-table-column prop="deviceCount" label="设备数量(个)">
        </el-table-column>
        <el-table-column prop="totalEnergy" label="总耗能量(kW·h)">
          <template slot-scope="scope">
{{Math.ceil(scope.row.totalEnergy * 1000) / 1000}}
</template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="totalPower" label="当前总功率(kW)">
<template slot-scope="scope">
 {{Math.ceil(scope.row.totalPower * 1000) / 1000}}
</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="overview" v-if="show.powerByConditon" v-loading="loading">
    <div class="header">
      <span>统计报表</span>
      <div class="numerial">
        <div>
          <el-cascader :options="selectOptions" id="selectOptions" v-model="areaValue" :show-all-levels="false" @change="numerialAreaChange"></el-cascader>
        </div>
        <div>
          <el-select v-model="timeValue" id="timeValue" placeholder="请选择" @change="numerialTypeChange">
            <el-option v-for="item in timeOptiion" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-date-picker
          align="right" popper-class="timeDateSet" :clearable="clearable" id="rangeValueStart" v-model="rangeValueStart" @change="timeChange('start')" :type="timeValue" placeholder="起始时间" :picker-options="pickerOptions">
          </el-date-picker>
          <el-date-picker popper-class="timeDateSet" :clearable="clearable" id="rangeValueEnd" align="right" v-model="rangeValueEnd" @change="timeChange('end')" :type="timeValue" placeholder="截止时间" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div><a ref="download" href.prevent="javaScript:void(0)" @click.prevent="download">下载</a></div>
      </div>
    </div>
    <div>
      <div id="historyCharts"></div>
      <div style="width: 100%;" id="historyTable">
        <el-table :data="tableDataReport" stripe :cell-style="cellStyle" :header-cell-style="headerStyle" max-height="470">
          <el-table-column prop="areaName" label="厂区">
          </el-table-column>
          <el-table-column prop="dateTime" label="时间" min-width="180">
          </el-table-column>
          <el-table-column prop="maxElec" label="最大电流(A)">
<template slot-scope="scope">
 {{Math.ceil(scope.row.maxElec * 1000) / 1000}}
</template>
          </el-table-column>
          <el-table-column prop="minElec" label="最小电流(A)">
<template slot-scope="scope">
 {{Math.ceil(scope.row.minElec * 1000) / 1000}}
</template>
          </el-table-column>
          <el-table-column prop="maxVolt" label="最大电压(v)">
<template slot-scope="scope">
 {{Math.ceil(scope.row.maxVolt * 1000) / 1000}}
</template>
          </el-table-column>
          <el-table-column prop="minVolt" label="最小电压(V)">
<template slot-scope="scope">
 {{Math.ceil(scope.row.minVolt * 1000) / 1000}}
</template>
          </el-table-column>
          <el-table-column prop="energy" label="能耗(kW·h)">
<template slot-scope="scope">
<span>
 {{Math.ceil(scope.row.energy * 1000) / 1000}}
  </span>
</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import echarts from 'echarts';
// 接口
import {
  zoneForm,
  list,
  report
} from './apis/LightStatistics.js';
export default {
  name: "LightStatistics",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      show: {
        CurDayHourPower: true,
        area: true,
        powerByConditon: true,
        historyCharts: true
      },
      // date: '',
      tableData: [],
      tableDataReport: [],
      clearable: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      getHistoryCharts: null,
      loading: true,
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
          top: '20px',
        },
        grid: {
          left: '40px',
          right: '40px',
          bottom: '50px'
        },
        xAxis: {
          data: [],
          type: 'category',
          // boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#d8d8d8"
            }
          },
          nameTextStyle: {
            fontFamily: 'Microsoft YaHei',
            color: '#505050'
          },
          axisLabel: {
            color: '#707070'
          },
          axisTick: {
            show: false,
            alignWithLabel: false
          },
          nameGap: 25,
          name: ''
        },
        yAxis: {
          name: 'kW·h          ',
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
            show: false,
            lineStyle: {
              color: '#eee'
            }
          }
        },
        dataZoom: [{
          show: false
        }],
        series: [],
      },
      timeValue: 'datetime',
      timeOptiion: [{
        value: 'year',
        label: '年'
      }, {
        value: 'month',
        label: '月'
      }, {
        value: 'date',
        label: '天'
      }, {
        value: 'datetime',
        label: '时'
      }],
      rangeValueStart: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
      rangeValueEnd: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      selectOptions: [],
      areaValue: [''],
      time: null,
    };
  },
  methods: {
    getFrom() {
      zoneForm()
        .then(res => {
          if (res.resultCode == 'success') {
            this.tableData = res.data;
          }
        })["catch"](() => {});
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
    // 改变表格样式
    cellStyleReport({
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
    headerStyleReport({
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
    getnumerialArea() {
      list()
        .then(res => {
          this.$root.Bus.$emit("showLoading", false);
          if (res.resultCode == 'success') {
            this.selectOptions = [];
            let children = [];
            // ids = '';
            res.data.forEach((v, i) => {
              if (v.zoneName != '') {
                children = [];
                // ids = '';
                if (v.categoryGroup) {
                  v.categoryGroup.forEach((vC, iC) => {
                    if (Object.values(vC) != '') {
                      children.push({
                        value: Object.keys(vC)[0],
                        label: Object.values(vC)[0]
                      })
                      // ids += Object.keys(vC) + '-';
                    }
                  })
                }
                if (children.length != 0) {
                  children.push({
                    // value: ids.substring(0, ids.length - 1),
                    value: 'all',
                    label: '全部组'
                  })
                }
                children.push({
                  value: 'categoryAll',
                  label: '该厂区'
                })
                this.selectOptions.push({
                  value: v.zoneId,
                  label: v.zoneName,
                  children: children
                })
              }
            })
            this.selectOptions.push({
              value: '',
              label: '全部厂区'
            })
            // console.log(this.selectOptions)
            this.getHistoryStatistic();
          }
        })["catch"](() => {
          this.$root.Bus.$emit("showLoading", false);
        });
    },
    numerialTypeChange() {
      this.rangeValueStart = '';
      this.rangeValueEnd = '';
    },
    numerialAreaChange() {
      this.$root.Bus.$emit("showLoading", true);
      this.getHistoryStatistic();
    },
    timeChange(t) {
      // 86400000
      this.$root.Bus.$emit("showLoading", true);
      if ((this.rangeValueStart != '') && (this.rangeValueEnd != '')) {
        if (!(this.$moment(this.rangeValueEnd).isAfter(this.rangeValueStart))) {
          t == 'end' ? this.rangeValueStart = '' : this.rangeValueEnd = '';
          this.$root.Bus.$emit("showLoading", false);
        } else if ((this.$moment(this.rangeValueEnd).diff(this.$moment(this.rangeValueStart)) > 172800306) && this.timeValue == 'datetime') {
          t == 'end' ? this.rangeValueStart = '' : this.rangeValueEnd = '';
          this.$message({
            type: 'info',
            message: '请选择在两天之内的时间'
          });
          this.$root.Bus.$emit("showLoading", false);
        } else if ((this.$moment(this.rangeValueEnd).diff(this.$moment(this.rangeValueStart), 'days') > 30) && this.timeValue == 'date') {
          t == 'end' ? this.rangeValueStart = '' : this.rangeValueEnd = '';
          this.$message({
            type: 'info',
            message: '请选择在30天之内的时间'
          });
          this.$root.Bus.$emit("showLoading", false);

        } else if ((this.$moment(this.rangeValueEnd).diff(this.$moment(this.rangeValueStart), 'month') > 24) && this.timeValue == 'month') {
          t == 'end' ? this.rangeValueStart = '' : this.rangeValueEnd = '';
          this.$message({
            type: 'info',
            message: '请选择在2年之内的时间'
          });
          this.$root.Bus.$emit("showLoading", false);

        } else if ((this.$moment(this.rangeValueEnd).diff(this.$moment(this.rangeValueStart), 'years') > 10) && this.timeValue == 'year') {
          t == 'end' ? this.rangeValueStart = '' : this.rangeValueEnd = '';
          this.$message({
            type: 'info',
            message: '请选择在10年之内的时间'
          });
          this.$root.Bus.$emit("showLoading", false);

        } else {
          this.getHistoryStatistic();
        }
      } else {
        this.$root.Bus.$emit("showLoading", false);
      }
    },
    ifSendAjax() {
      let obj = {};
      if (this.rangeValueStart == '' || this.rangeValueEnd == '') {
        this.$root.Bus.$emit("showLoading", false);
        return false;
      }
      switch (this.timeValue) {
        case 'datetime':
          obj = {
            zoneId: '',
            categoryId: '',
            timeType: 'hour',
            startTime: this.$moment(this.rangeValueStart).format('YYYY-MM-DD HH'),
            endTime: this.$moment(this.rangeValueEnd).format('YYYY-MM-DD HH'),
          }
          break;
        case 'date':
          obj = {
            zoneId: '',
            categoryId: '',
            timeType: 'day',
            startTime: this.$moment(this.rangeValueStart).format('YYYY-MM-DD'),
            endTime: this.$moment(this.rangeValueEnd).format('YYYY-MM-DD'),
          }
          break;
        case 'month':
          obj = {
            zoneId: '',
            categoryId: '',
            timeType: 'month',
            startTime: this.$moment(this.rangeValueStart).format('YYYY-MM'),
            endTime: this.$moment(this.rangeValueEnd).format('YYYY-MM'),
          }
          break;
        case 'year':
          obj = {
            zoneId: '',
            categoryId: '',
            timeType: 'year',
            startTime: this.$moment(this.rangeValueStart).format('YYYY'),
            endTime: this.$moment(this.rangeValueEnd).format('YYYY'),
          }
          break;
      }
      // console.log(this.areaValue)
      if (this.areaValue.length == 1 && this.areaValue[0] == '') {
        obj.zoneId = 'all';
      } else if (this.areaValue[1] == 'categoryAll') {
        obj.zoneId = this.areaValue[0];
      } else if (this.areaValue[1].includes('-')) {
        obj.categoryId = 'all';
      } else {
        obj.categoryId = this.areaValue[1]
      }
      if (obj.countUnit != '') {
        return obj;
      }
      return false;
    },
    download() {
      let obj = this.ifSendAjax();
      if (obj) {
        window.location.href = `${this.url}lightStatistic/power/report/download?zoneId=${obj.zoneId}&categoryId=${obj.categoryId}&timeType=${obj.timeType}&startTime=${obj.startTime}&endTime=${obj.endTime}`
      }
    },
    seriesNameFindIndex(id, objArr, v) {
      return objArr.findIndex(item => item[v] === id)
    },
    getHistoryStatistic() {
      let obj = this.ifSendAjax();
      // console.log(obj)
      if (obj) {
        report(obj)
          .then(res => {
            this.loading = false;
            this.$root.Bus.$emit("showLoading", false);
            this.tableDataReport = [];
            this.getHistoryCharts.clear();
            if (res.resultCode == 'success') {
              this.tableDataReport = [...res.data];
              // 基于准备好的dom，初始化echarts实例
              this.option.xAxis.boundaryGap = true;
              this.option.tooltip.axisPointer.type = 'shadow';
              // this.option.dataZoom[0].show = true;
              this.option.grid.bottom = '60px';
              let xAxis = [],
                legend = [],
                data = [];
              res.data.forEach((v, i) => {
                if (legend.indexOf(v.areaName) === -1) {
                  legend.push(v.areaName);
                }
                if (xAxis.indexOf(v.dateTime) === -1) {
                  xAxis.push(v.dateTime);
                }
              })
              // console.log(legend)
              // console.log(xAxis)
              for (let k = 0; k < legend.length; k++) {
                data[k] = [];
                xAxis.forEach((v, i) => {
                  res.data.forEach((vR, iR) => {
                    if (v == vR.dateTime && legend[k] == vR.areaName) {
                      // console.log(vR.dateTime)
                      data[k].push(vR.energy);
                    }
                  })
                })
              }
              // console.log(data)
              this.option.legend.data = [...legend];
              this.option.xAxis.data = [...xAxis];
              this.option.series = [];
              for (let i = 0; i < data.length; i++) {
                this.option.series.push({
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
                  name: legend[i],
                  type: 'bar',
                  data: data[i],
                  animationDuration: 2000,
                  animationDelayUpdate: function(idx) {
                    return idx * 5;
                  }
                })
              }
              this.getHistoryCharts.setOption(this.option);
              this.resizeGetHistoryCharts();
              window.addEventListener("resize", this.resizeGetHistoryCharts);
            } else {
              this.option.xAxis.data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
              this.option.legend.data = [];
              this.option.series = [];
              this.getHistoryCharts.setOption(this.option);
              this.$message({
                type: 'info',
                message: '统计报表暂无数据!'
              });
            }
          }).catch(() => {
            this.$root.Bus.$emit("showLoading", false);
            this.loading = false;
            // this.$message({
            //   type: 'error',
            //   message: '网络请求有误，请刷新后重试'
            // });
          });
      }
    },
    resizeGetHistoryCharts() {
      setTimeout(() => {
        this.getHistoryCharts.resize();
      }, )
    }
  },
  mounted() {
    this.getFrom();
    // this.show.powerByConditon = true;
    this.getHistoryCharts = echarts.init(document.getElementById('historyCharts'));
    this.getnumerialArea();
  },
  beforeDestroy: function() {
    //页面销毁时关闭长连接
    window.removeEventListener("resize", this.resizeGetHistoryCharts);
    this.getHistoryCharts = null;
    if (this.time != null) {
      clearTimeout(this.time);
      this.time = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.timeDateSet {
  .el-time-spinner {
    >div:nth-of-type(1) {
      width: 100%;
    }
    >div:nth-of-type(2) {
      display: none;
    }
    >div:nth-of-type(3) {
      display: none;
    }
  }
  .el-picker-panel__footer button:nth-of-type(1) {
    display: none;
  }
}

.LightStatistics {
  width: 100%;
  height: 100%;
  .overview {
    &:last-child {
      overflow: hidden;
      height: 830px;
      margin-bottom: 30px;
      @include media($m1366) {
        margin-bottom: 15px;
      }
    }
    .header {
      >div {
        @include position(absolute, 50%, 20px, none, none);
        transform: translateY(-50%);
      }
      ul {
        height: 100%;
        float: right;
        li {
          float: left;
          height: 22px;
          margin: 18px 16px 0;
          @include media($m1024) {
            margin: 18px 10px 0;
          }
          font-size: 14px;
          color: #303030;
          line-height: 10px;
          cursor: pointer;
          &.activeBtn {
            color: #2c5ac2;
            font-weight: bold;
            border-bottom: 3px solid #2c5ac2;
          }
        }
      }
      .numerial {
        >div {
          float: left;
          margin-left: 12px;
          @include media($m1024) {
            margin-left: 2px;
          }
          height: 30px;
          .el-cascader,
          .el-select,
          .el-date-editor {
            span {
              font-size: 14px;
              color: #2c5ac2;
            }
            height: 30px;
            line-height: 30px;
            float: left;
            .el-input__inner {
              height: 30px;
              border: none;
              line-height: 30px;
              color: #2c5ac2;
              background-color: #f2f4f6;
              border-radius: 4px;
            }
            .el-input__icon,
            .el-input__suffix-inner {
              line-height: 30px;
            }
          }
          .el-date-editor {
            height: 30px;
            line-height: 30px;
            border: none;
            .el-input__icon,
            .el-range-separator {
              line-height: 22px;
            }
          }
          &:nth-of-type(1) {
            width: 120px;
            background-color: #ffffff;
          }
          &:nth-of-type(2) {
            width: 70px;
            background-color: #ffffff;
          }
          &:nth-of-type(3) {
            .el-input--suffix .el-input__inner {
              padding-right: 0;
            }
            float: left;
            >div:first-child {
              width: 192px;
              background-color: #ffffff;
              padding-right: 10px;
            }
            >div:last-child {
              margin-left: 12px;
              @include media($m1024) {
                margin-left: 2px;
              }
              width: 192px;
              background-color: #ffffff;
              padding-right: 10px;
            }
          }
          &:nth-of-type(4) {
            width: 50px;
            height: 30px;
            border-radius: 4px;
            line-height: 30px;
            text-align: center;
            background: #2c5ac2;
            a {
              color: #fff;
              cursor: pointer;
              font-size: 14px;
            }
          }
        }
      }
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      content: '';
      background-color: transparent;
    }
    #energyMsg,
    #historyCharts {
      height: 300px;
    }
  }
}
</style>
