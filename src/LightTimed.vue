<template>
<div class="LightTimed">
  <div class="overview">
    <p class="header">
      <span>定时控制</span>
      <span class="fr el-icon-plus" @click="newTable" v-if="show.save">新建定时</span>
    </p>
    <div style="padding-bottom:30px;" class="boxLightTime">
      <el-table  :data="tableData" stripe highlight-current-row style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle">
        <el-table-column prop="name" label="定时名称">
        </el-table-column>
        <el-table-column prop="time" label="设定时间">
          <template slot-scope="scope">
    {{scope.row.time}}<br/><div style="cursor:pointer" :title="`${scope.row.week.join(' ')}`">{{scope.row.week.join(' ')}}</div>
</template>
        </el-table-column>
        <el-table-column prop="type" label="设备状态" width="90">
        </el-table-column>
        <el-table-column prop="description" label="定时描述">
        </el-table-column>
        <el-table-column label="编辑" width="240" v-if="show.update||show.remove">
<template slot-scope="scope">
<el-button v-if="show.update" type="text" @click="goLightTimeSet(scope.row)" size="small" class="detailsBtn">
  <img src="./assets/img/LightTimed/bianji.png" alt="">编辑</el-button>
<el-button v-if="show.remove" type="text" size="small" @click="delTime(scope.row)" class="delBtn"><i class="el-icon-error"></i>删除</el-button>
</template>
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="100">
<template slot-scope="scope">
<el-switch v-model="scope.row.enabled" @change="typeChange(scope.row)">
</el-switch>
</template>
        </el-table-column>
        <el-table-column prop="" label="执行结果" width="108">
<template slot-scope="scope">
<button @click="showTable(scope.row)" class="search"><i class="el-icon-search"></i>查看</button>
</template>
        </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next" prev-text="上一页" next-text="下一页"
    :total="totalPage" :page-size="pageSize" :current-page.sync="page" @current-change="getTable">
  </el-pagination>
    </div>
  </div>
  <el-dialog
  :show-close = 'false'
  :title="title"
  :visible.sync="centerDialogVisible"
  center :close-on-click-modal="closeclickmodal">
  <el-form class="fromRequire" ref="form" :model="form" label-width="104px" label-position="left">
  <el-form-item label="定时名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="选择厂区">
    <el-select :disabled="title=='详情'" v-model="form.zoneId" id="formZoneId" placeholder="选择厂区" @change="changeZoneId">
       <el-option v-for="item in zoneIdOptions" :key="item.id" :label="item.shortAddr" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="选择设备分组">
    <el-select :disabled="title=='详情'" v-model="form.categoryId" id="formCategoryId" placeholder="选择设备分组">
       <el-option v-for="item in categoryIdOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="设定时间">
      <el-time-picker
        v-model="form.time"
        placeholder="选择日期时间">
      </el-time-picker>
    </el-col>
  </el-form-item>
  <el-form-item label="设定周期">
    <el-select v-model="form.week" id="formWeek" multiple placeholder="设定周期">
    <el-option
      v-for="item in weekOptions"
      :key="item.id"
      :label="item.text"
      :value="item.id">
    </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="设备状态">
    <el-select v-model="form.type" id="form.Type" placeholder="选择设备状态">
       <el-option label="开灯" value="1">
      </el-option>
      <el-option label="关灯" value="0">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="是否启用">
    <el-switch v-model="form.enabled">
</el-switch>
  </el-form-item>
  <el-form-item label="描述">
    <el-input type="textarea" resize="none" v-model="form.description"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancle">取消</el-button>
    <el-button type="primary" @click="save">保存</el-button>
  </span>
</el-dialog>
  <el-dialog
  title="执行结果"
  :visible.sync="centerDialogVisible1"
  width="30%"
  center :close-on-click-modal="closeclickmodal">
        <el-table max-height="500" :data="tableData1" stripe style="width: 100%;" :cell-style="cellStyle1" :header-cell-style="headerStyle1">
        <el-table-column prop="operate" label="设备状态">
        </el-table-column>
        <el-table-column prop="gmtCreate" label="执行时间" width="200">
        </el-table-column>
        <el-table-column prop="returnResult" label="执行结果">
        </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next" prev-text="上一页" next-text="下一页"
    :total="totalPage1" :page-size="pageSize1" :current-page.sync="page1" @current-change="getTable1">
  </el-pagination>
</el-dialog>
</div>
</template>

<script>
// 接口
import {
  listScheduleExecuteResult,
  findLightCategory,
  listLightSchedule,
  saveLightSchedule,
  updateLightSchedule,
  removeLightSchedule,
  enabled
} from './apis/LightTimed.js';
import {
  findLightConfAreaTemp,
} from './apis/LightCtrl.js';
export default {
  name: "LightTimed",
  data() {
    return {
      show: {
        enabled: true,
        list: true,
        remove: true,
        save: true,
        update: true
      },
      closeclickmodal: false,
      openType: 0,
      tableData: [],
      tableData1: [],
      totalPage: 0,
      pageSize: 10,
      page: 1,
      totalPage1: 0,
      pageSize1: 5,
      page1: 1,
      lightScheduleId: 0,
      centerDialogVisible: false,
      centerDialogVisible1: false,
      form: {
        // id: 0,
        name: '',
        time: '',
        enabled: '', //是否启用
        type: '', //开关
        categoryId: '',
        zoneId: '',
        week: [],
        description: ''
      },
      weekOptions: [{
        id: 1,
        text: '周一'
      }, {
        id: 2,
        text: '周二'
      }, {
        id: 3,
        text: '周三'
      }, {
        id: 4,
        text: '周四'
      }, {
        id: 5,
        text: '周五'
      }, {
        id: 6,
        text: '周六'
      }, {
        id: 7,
        text: '周天'
      }],
      categoryIdOptions: [],
      zoneIdOptions: [],
      title: '新建定时'
    };
  },
  methods: {
    showTable(row) {
      this.tableData1 = [];
      // console.log(this.page)
      this.getTable1(row);
      this.centerDialogVisible1 = true;
    },
    getTable1(row) {
      if (row.id !== undefined) {
        this.lightScheduleId = row.id;
        this.page1 = 1;
        this.totalPage1 = 0;
      }
      // console.log(this.lightScheduleId)
      this.$root.Bus.$emit("showLoading", true);
      listScheduleExecuteResult(this.page1, this.pageSize1, this.lightScheduleId)
        .then(res => {
          if (res.resultCode == 'success') {
            res.data.rows.forEach((v, i) => {
              v.operate == 'ON' ? v.operate = '开灯' : v.operate = '关灯';
            })
            this.tableData1 = res.data.rows;
            this.totalPage1 = res.data.totalCount;
            this.$root.Bus.$emit("showLoading", false);
          }
        })
    },
    cancle() {
      this.centerDialogVisible = false;
      this.form = {
        // id: 0,
        name: '',
        time: '',
        enabled: '',
        type: '',
        categoryId: '',
        week: [],
        description: ''
      };
    },
    changeZoneId() {
      this.form.categoryId = '';
      this.getcategoryIdOptions();
    },
    getcategoryIdOptions() {
      findLightCategory(this.form.zoneId)
        .then(res => {
          if (res.resultCode == 'success') {
            this.categoryIdOptions = res.data;
            // console.log(this.form)
            if (this.openType == 1) {
              // console.log(this.form)
              this.centerDialogVisible = true;
            } else {
              this.form.categoryId = '';
            }
          }
        })
    },
    getzoneIdOptions() {
      findLightConfAreaTemp()
        .then(res => {
          if (res.resultCode == 'success') {
            this.zoneIdOptions = JSON.parse(res.data.lightAreaInfo);
            if (this.openType == 1) {
              this.getcategoryIdOptions();
            } else {
              this.categoryIdOptions = [];
              this.centerDialogVisible = true;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
    },
    getTable() {
      this.$root.Bus.$emit("showLoading", true);
      this.pageSize = Math.round(($('.overview').height() - 296) / 52);
      this.tableData = [];
      listLightSchedule(this.page, this.pageSize)
        .then(res => {
          if (res.resultCode == 'success') {
            res.data.rows.forEach((v, i) => {
              v.type == 1 ? v.type = '开灯' : v.type = '关灯';
              v.enabled == 1 ? v.enabled = true : v.enabled = false;
              let week = v.week.split(',');
              week.forEach((v, i) => {
                // console.log(v)
                switch (v) {
                  case '1':
                    week[i] = '周一';
                    break;
                  case '2':
                    week[i] = '周二';
                    break;
                  case '3':
                    week[i] = '周三';
                    break;
                  case '4':
                    week[i] = '周四';
                    break;
                  case '5':
                    week[i] = '周五';
                    break;
                  case '6':
                    week[i] = '周六';
                    break;
                  case '7':
                    week[i] = '周天';
                    break;
                }
              })
              v.week = week;
              week = null;
            })
            this.tableData = res.data.rows;
            this.totalPage = res.data.totalCount;
            this.$root.Bus.$emit("showLoading", false);
          }
        }).catch(() => {
          this.$root.Bus.$emit("showLoading", false);
          this.$message({
            type: 'error',
            message: '获取失败'
          });
        });
    },
    save() {
      let sendAjax = true;
      // console.log(this.form)
      for (let i in this.form) {
        if ((i != 'description' && i != 'enabled' && i != 'week' && this.form[i] == '') || (i == 'week' && this.form[i].length == 0)) {
          console.log(111)
          this.$message({
            type: 'error',
            message: '请填写完整'
          });
          sendAjax = false;
          return;
        }
      }
      if (this.form.name.indexOf('null') != -1 || this.form.name.indexOf('undefined') != -1) {
        this.$message({
          type: 'info',
          message: '请输入正确的定时名称'
        });
        return;
      }
      if (this.form.description.indexOf('null') != -1 || this.form.description.indexOf('undefined') != -1) {
        this.$message({
          type: 'info',
          message: '请输入正确的描述'
        });
        return;
      }
      if (sendAjax) {
        this.$root.Bus.$emit("showLoading", true);
        let obj = JSON.parse(JSON.stringify(this.form));
        if (obj.enabled === '') {
          obj.enabled = true;
        }
        Boolean(obj.enabled) == true ? obj.enabled = 1 : obj.enabled = 0;
        obj.type = Number(obj.type);
        obj.time = this.$moment(obj.time).format("HH:mm:ss");
        obj.week.forEach((v, i) => {
          switch (v) {
            case '周一':
              obj.week[i] = '1';
              break;
            case '周二':
              obj.week[i] = '2';
              break;
            case '周三':
              obj.week[i] = '3';
              break;
            case '周四':
              obj.week[i] = '4';
              break;
            case '周五':
              obj.week[i] = '5';
              break;
            case '周六':
              obj.week[i] = '6';
              break;
            case '周天':
              obj.week[i] = '7';
              break;
          }
        })
        obj.week = obj.week.join(',');
        let formData = new FormData();
        formData.append('name', obj.name)
        formData.append('zoneId', obj.zoneId)
        formData.append('categoryId', obj.categoryId)
        formData.append('type', obj.type)
        formData.append('week', obj.week)
        formData.append('time', obj.time)
        formData.append('description', obj.description)
        formData.append('enabled', obj.enabled)
        if (this.openType == 0) {
          saveLightSchedule(formData)
            .then(res => {
              if (res.resultCode == 'success') {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                obj = null;
                this.getTable();
                this.cancle();
                this.$root.Bus.$emit("showLoading", false);
                formData = null;
              }
            })
        } else {
          // this.zoneIdOptions.forEach((v, i) => {
          //   if (obj.zoneId == v.id) {
          //     obj.zoneName = v.shortAddr;
          //   }
          // })
          // this.categoryIdOptions.forEach((v, i) => {
          //   if (obj.categoryId == v.id) {
          //     obj.categoryName = v.name;
          //   }
          // })
          formData.append('zoneName', obj.zoneName)
          formData.append('categoryName', obj.categoryName)
          formData.append('id', obj.id)
          updateLightSchedule(formData)
            .then(res => {
              if (res.resultCode == 'success') {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                obj = null;
                this.getTable();
                this.cancle();
                this.$root.Bus.$emit("showLoading", false);
                formData = null;
              }
            })
        }
      }
    },
    delTime(row) {
      this.$confirm('删除此条定时信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // console.log(row);
        this.$root.Bus.$emit("showLoading", true);
        removeLightSchedule(row.id)
          .then(res => {
            if (res.resultCode == 'success') {
              this.getTable();
              this.$root.Bus.$emit("showLoading", false);
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消设置'
        });
      });
    },
    newTable() {
      this.title = '新建定时';
      this.cancle();
      this.getzoneIdOptions();
      this.openType = 0;
      // console.log(this.form)
    },
    goLightTimeSet(row) {
      this.title = '详情';
      // console.log(row)
      this.form = { ...row
      };

      let time = row.time.split(':');
      this.form.time = new Date(2019, 4, 2, time[0], time[1], time[2]);
      // console.log(this.form.time)
      this.form.type = this.form.type == '开灯' ? '1' : '0';
      // this.form.zoneId = String(this.form.zoneName);
      // this.form.zoneId = String(this.form.zoneName);
      console.log(this.form)
      // this.form.type = String(this.form.type);
      this.openType = 1;
      this.getzoneIdOptions();
    },
    typeChange(row) {
      // console.log(row);
      let state = false;
      row.enabled == true ? state = 1 : state = 0;
      if (!this.show.enabled) {
        state == 1 ? row.enabled = false : row.enabled = true;
        this.$message({
          type: 'info',
          message: '无操作权限'
        });
      } else {
        this.$confirm('切换此条定时状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$root.Bus.$emit("showLoading", true);
          enabled(row.id, state)
            .then(res => {
              this.$root.Bus.$emit("showLoading", false);
              if (res.resultCode == 'success') {
                this.getTable();
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
              } else {
                state == 1 ? row.enabled = false : row.enabled = true;
              }
            })["catch"](() => {
              this.$root.Bus.$emit("showLoading", false);
              state == 1 ? row.enabled = false : row.enabled = true;
            });
        }).catch(() => {
          // console.log(state)
          state == 1 ? row.enabled = false : row.enabled = true;
          this.$root.Bus.$emit("showLoading", false);
          this.$message({
            type: 'info',
            message: '已取消设置'
          });
        });
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
    // 改变表格样式
    cellStyle1({
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
    headerStyle1({
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
  },
  mounted() {
    // let menuList = JSON.parse(sessionStorage.getItem('stringPermissions'));
    // if (menuList.includes('api:v1:schedule:list')) {
    //   this.show.list = true;
    this.getTable();
    // } else {
    //   this.show.list = false;
    // }
    // if (menuList.includes('api:v1:schedule:update')) {
    //   this.show.update = true;
    // } else {
    //   this.show.update = false;
    // }
    // if (menuList.includes('api:v1:schedule:save')) {
    //   this.show.save = true;
    // } else {
    //   this.show.save = false;
    // }
    // if (menuList.includes('api:v1:schedule:remove')) {
    //   this.show.remove = true;
    // } else {
    //   this.show.remove = false;
    // }
    // if (menuList.includes('api:v1:schedule:enabled')) {
    //   this.show.enabled = true;
    // } else {
    //   this.show.enabled = false;
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.LightTimed {
  width: 100%;
  height: 100%;
  position: relative;
  input::-webkit-input-placeholder {
    color: #828282;
  }
  input:disabled,
  .el-textarea.is-disabled .el-textarea__inner {
    color: #C0C4CC !important;
  }
  .el-pagination {
    text-align: center;
  }
  .el-table .cell {
    overflow: visible;
  }
  .el-switch__core {
    border-color: #d1d3d8;
    background-color: #dbdee3;
    width: 40px !important;
    height: 18px !important;
    &::after {
      width: 20px;
      height: 20px;
      background-color: #b1b5c0;
      @include position(absolute, 50%, none, none, -2px);
      margin-top: -10px;
    }
  }
  .el-switch.is-checked .el-switch__core {
    border-color: #9eb5e1;
    background-color: #b1c6ef;
    &::after {
      background-color: #3c70d7;
      @include position(absolute, 50%, none, none, 37px);
    }
  }
  .fromRequire {
    .el-form-item:nth-of-type(1),
    .el-form-item:nth-of-type(2),
    .el-form-item:nth-of-type(3),
    .el-form-item:nth-of-type(4),
    .el-form-item:nth-of-type(5),
    .el-form-item:nth-of-type(6) {
      position: relative;
      overflow: visible;
      label::after {
        @include position(absolute, 0, none, 0, -12px);
        content: '*';
        color: #F56C6C;
      }
    }
  }
  .overview {
    height: 100%;
    .el-table {
      margin: 30px 0;
      @include media($m1440) {
        margin: 20px 0;
      }
      td {
        padding: 0;
        button {
          width: 80px;
          height: 30px;
          font-size: 14px;
          padding: 0;
          margin: 10px 0;
          border-radius: 4px;
          border: solid 1px #68c161;
          background-color: transparent;
          i {
            margin-right: 6px;
          }
          @include media($m1660) {
            margin: 7px 0;
          }
          &.detailsBtn {
            color: #6ecd8b;
          }
          &.delBtn {
            color: #ed5151;
            border: solid 1px #ed5151;
            margin-left: 20px;
          }
          &.search {
            color: #ffab33;
            border: solid 1px #ffab33;
          }
          img {
            vertical-align: middle;
            margin-right: 6px;
          }
        }
        &:nth-of-type(2) .cell div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:last-child .cell {
          overflow: visible;
        }
      }
    }
    ul.el-pager li.active {
      color: #496fec;
      background: url('./assets/img/LightTimed/hover.png') no-repeat center 20px;
      font-weight: bold;
    }
  }
  .el-form-item>div {
    text-align: left;
  }
  .routerView {
    @include position(absolute,
    0,
    0,
    0,
    0);
    z-index: 3;
    background: #fff;
  }
}
</style>
