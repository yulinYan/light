<template>
<div class="LightSet">
  <div class="overview">
    <p class="header">
      <span>项目设置</span>
      <!-- <b class="appWeb"><b :class="{current:changeWebB=='web'}" @click="changeWeb('web')">web</b><b :class="{current:changeWebB=='app'}"  @click="changeWeb('app')">app</b></span> -->
    </p>
    <div class="projextSet">
      <div v-if="show.area_conf||show.conf_area" class="form">
        <div v-if="tableData.length != 0">
          <label for="">区域名称：</label>
          <el-select v-model="projectForm.name" id="projectFormName" clearable placeholder="选择区域名" @change="projectFormNameChange">
            <el-option v-for="item in groupOptions" :key="item.shortAddr" :label="item.shortAddr" :value="item.shortAddr">
            </el-option>
          </el-select>
        </div>
        <div v-if="tableData.length != 0">
          <label for="">备注：</label>
          <el-input v-model="projectForm.remarks"></el-input>
        </div>
        <div>
          <label for="">上传地图：</label>
          <div>
            <input type="text" v-model="projectForm.fileName" disabled placeholder="仅支持JPG、PNG格式，图片小于1M">
            <div class="fileBtn">浏览
              <input id="setMap" type="file" accept="image/jpg,image/png" style="width: 100%;height: 100%;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setMap('#setMap')">
            </div>
          </div>
        </div>
      </div>
      <el-button v-if="show.area_conf||show.conf_area" type="primary" @click="addArea">添加</el-button>
      <el-table :data="tableData" stripe style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle" :height="tableHeight">
        <el-table-column prop="" label="区域名称">
          <template slot-scope="scope">
  {{(scope.row.areaName==-1||scope.row.areaName==-2)?title:scope.row.areaName}}
</template>
        </el-table-column>
        <el-table-column prop="comment" label="备注">
        </el-table-column>
        <el-table-column prop="picUrlPath" label="地图">
<template slot-scope="scope">
<img style="max-height: 27px;margin: auto;max-width: 150px;margin-left: 24px;" :src="`${ipPix}${scope.row.picUrlPath}`" alt="">
<div class="fileBtn fileBtnPic"><img :src="changePic" alt="">
  <input :id='`setPic${scope.row.id}`' type="file" accept="image/jpg,image/png" style="width: 32px;height: 32px;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setMap(`#setPic${scope.row.id}`,scope.row)">
</div>
</template>
        </el-table-column>
        <el-table-column label="操作" width="240" v-if="show.goSetLight||show.delConfArea">
<template slot-scope="scope">
<button v-if="show.goSetLight" type="text" @click="goLightTimeSet(scope.row)" size="small" class="detailsBtn">
  <i class="el-icon-edit"></i>{{(scope.row.areaName==-1||scope.row.areaName==-2)?'区域':'配灯'}}</button>
<button v-if="show.delConfArea" type="text" size="small" @click="delArea(scope.row)" class="delBtn"><i class="el-icon-error"></i>删除</button>
</template>
        </el-table-column>
    </el-table>
  </div>
  </div>
</div>
</template>

<script>
import changePic from './assets/img/LightSet/changePic.png';
import {
  confAreaPic,
  confArea,
  areaList,
  areaConf,
  removeconfArea
} from './apis/LightSet.js';
export default {
  name: "LightSet",
  data() {
    return {
      title: document.title,
      ipPix: this.ipPix,
      changePic: changePic,
      show: {
        delConfArea: true,
        area_conf: true,
        shortAddrAll: true,
        conf_area: true,
        confAreaLightTmp: true,
        goSetLight: true
      },
      // isCovered: false,
      projectForm: {
        name: '',
        remarks: '',
        file: '',
        fileName: ''
      },
      groupOptions: [],
      tableData: [],
      changeWebB: 'web',
      tableHeight: 0
    };
  },
  methods: {
    changeWeb(info) {
      if (info == 'web') {
        this.changeWebB = 'web';
      } else {
        this.changeWebB = 'app';
      }
      this.$root.Bus.$emit("showLoading", true);
      this.gettableData();
    },
    getgroupOptions() {
      areaList(this.changeWebB)
        .then(res => {
          if (res.resultCode == 'success' && res.data) {
            this.groupOptions = res.data;
          } else {
            this.groupOptions = [];
          }
        })
    },
    gettableData() {
      areaConf(this.changeWebB)
        .then(res => {
          this.$root.Bus.$emit("showLoading", false);
          if (res.resultCode == 'success') {
            this.tableData = res.data;
            if (res.data.length != 0) {
              this.getgroupOptions();
            } else {
              this.groupOptions = [];
            }
          }
        })["catch"](() => {
          this.$root.Bus.$emit("showLoading", false);
        });
    },
    setMap(type, row) {
      console.log(1)
      let img = $(type)[0].files[0];
      let _this = this;
      console.log(img)
      if (img != undefined) {
        if (img.size / 1024 > 1024) {
          this.$message({
            type: 'error',
            message: '图片大小大于1M!'
          });
          return;
        }
        let reader = new FileReader();
        reader.onload = function() {
          if (type == '#setMap') {
            _this.projectForm.file = img;
            _this.projectForm.fileName = img.name;
            // console.log(_this.projectForm.file)
            _this.$message({
              type: 'info',
              message: '图片已上传'
            });
          } else {
            console.log(row)
            console.log(img)
            let formData = new FormData();
            formData.append('zoneId', row.id)
            formData.append('file', img)
            formData.append('deviceType', _this.changeWebB)
            _this.$root.Bus.$emit("showLoading", true);
            confAreaPic(formData)
              .then(res => {
                _this.$root.Bus.$emit("showLoading", false);
                if (res.resultCode == 'success') {
                  _this.$message({
                    type: 'success',
                    message: '图片切换成功'
                  });
                  _this.gettableData();
                }
              })["catch"](() => {
                _this.$root.Bus.$emit("showLoading", false);
              });
          }
        };
        reader.readAsDataURL(img);
      } else {
        this.$message({
          type: 'error',
          message: '图标不能为空'
        });
      }
    },
    projectFormNameChange() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.projectForm.name == this.tableData[i].areaName) {
          this.projectForm.name = '';
          this.$message({
            type: 'info',
            message: '此区域已添加'
          });
        }
      }
    },
    addArea() {
      if ((this.groupOptions.length != 0 && this.projectForm.name == '' && this.projectForm.name != -1 && this.projectForm.name != -2) || this.projectForm.file == '') {
        this.$message({
          type: 'error',
          message: '请填写完整'
        });
        return;
      }
      console.log(this.projectForm.file == '')
      if (this.tableData.length === 0) {
        this.$message({
          type: 'info',
          message: '第一条默认为总区域信息'
        });
      }
      this.$root.Bus.$emit("showLoading", true);
      let formData = new FormData();
      formData.append('areaName', this.projectForm.name)
      formData.append('comment', this.projectForm.remarks)
      formData.append('file', this.projectForm.file)
      formData.append('deviceType', this.changeWebB)
      confArea(formData)
        .then(res => {
          this.$root.Bus.$emit("showLoading", false);
          if (res.resultCode == 'success') {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.projectForm = {
              name: '',
              remarks: '',
              file: '',
              fileName: ''
            }
            $('#setMap').val('');
            this.gettableData();
          }
        }).catch((err) => {
          console.log(err.response)
          this.$root.Bus.$emit("showLoading", false);
          this.$message({
            type: 'error',
            message: err.response.data.message.split(',')[0]
          });
        });
    },
    goLightTimeSet(row) {
      localStorage.setItem('areaMsg', JSON.stringify(row));
      // console.log(row)
      this.$router.push({
        path: '/LightBox/SetMap',
        query: {
          type: (row.areaName === "-1" || row.areaName === "-2") ? 'factory' : 'light',
          info: this.changeWebB
        }
      })
    },
    delArea(row) {
      this.$confirm('删除此条信息,此次删除会将区域下的灯全部信息删除(会影响其他版块信息)?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // console.log(row);
        if (row.areaName == '-1') {
          this.$confirm('此次删除会将所有灯的全部信息删除，请再次确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            // console.log(row);
            this.$root.Bus.$emit("showLoading", true);
            removeconfArea(row.areaName, this.changeWebB)
              .then(res => {
                this.$root.Bus.$emit("showLoading", false);
                if (res.resultCode == 'success') {
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  this.gettableData();
                }
              }).catch(() => {
                this.$root.Bus.$emit("showLoading", false);
                this.$message({
                  type: 'error',
                  message: '网络连接错误'
                });
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消设置'
            });
          });
        } else {
          this.$root.Bus.$emit("showLoading", true);
          removeconfArea(row.areaName, this.changeWebB)
            .then(res => {
              this.$root.Bus.$emit("showLoading", false);
              if (res.resultCode == 'success') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.gettableData();
              }
            })
        }
      }).catch(() => {
        this.$root.Bus.$emit("showLoading", false);
        this.$message({
          type: 'info',
          message: '已取消设置'
        });
      });
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
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = $('.projextSet').height() - 242;
    })
    window.addEventListener('resize', () => {
      this.tableHeight = $('.projextSet').height() - 242;
    })
    this.changeWebB = this.$route.query.info == 'app' ? 'app' : 'web';
    this.gettableData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
@import "./assets/styles/common";
.LightSet {
  width: 100%;
  height: 100%;
  input::-webkit-input-placeholder {
    color: rgb(192, 196, 204);
  }
  .overview {
    overflow: hidden;
    height: 100%;
    p.header {
      .appWeb {
        float: right;
        >b {
          width: 28px;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          font-size: 14px;
          height: 32px;
          line-height: 32px;
          margin-left: 15px;
        }
        .current {
          border-bottom: 3px solid #2c5ac2;
          font-weight: bold;
          color: #2c5ac2;
        }
      }
    }
    .form {
      // height: 150px;
      @include media($m800) {
        height: 178px;
      }
      margin-bottom: 32px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      >div {
        width: 30%;
        @include media($m800) {
          width: 50%;
        }
        height: 36px;
        line-height: 36px;
        &:nth-child(-n+3) {
          margin: 20px 0;
          @include media($m800) {
            margin: 0;
          }
        }
        &:nth-of-type(4) {
          margin-bottom: 20px;
          @include media($m800) {
            margin-bottom: 0px;
          }
        }
        &:nth-child(-n+2) {
          @include media($m800) {
            margin-top: 20px;
          }
        }
        label {
          float: left;
          width: 105px;
          text-align: left;
        }
        >div {
          float: right;
          @include position(relative, none, none, none, none);
          width: calc( 100% - 105px);
          .el-input__inner,
          input {
            height: 36px;
            padding: 0 15px;
            background-color: #f1f3f6;
            border-radius: 4px;
            border: none;
            @include text-overflow();
          }
          input::-webkit-input-placeholder {
            color: #828282;
          }
        }
      }
    }
    button {
      width: 80px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      background-color: #1f6ed4;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      color: #ffffff;
    }
    .projextSet {
      text-align: left;
      height: calc(100% - 52px);
      .form {
        // height: 148px;
        margin-bottom: 4px;
        display: inline-block;
        >div {
          margin: 14px 0;
          width: 405px;
        }
      }
      .el-table {
        margin: 18px 0; // height: calc(100% - 242px);
        // width: calc(100% - 5px) !important;
        // overflow: visible;
        // .el-table__body-wrapper {
        //   height: calc(100% - 60px);
        //   width: calc(100% + 5px);
        //   overflow-y: auto;
        //   overflow-x: visible;
        // }
        td:last-child .cell {
          overflow: visible;
        }
        i {
          margin-right: 6px;
        }
      }
      button {
        width: 80px;
        line-height: 8px;
        margin: 4px 0;
      }
      .fileBtn {
        @include position(absolute, 3px, -100px, none, none);
        width: 80px;
        height: 30px;
        background-color: #64b2ff;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        color: #ffffff;
        &.fileBtnPic {
          @include position(relative, 0px, 0px, none, none);
          display: inline-block;
          width: 32px;
          box-shadow: none;
          background-color: transparent; // margin-right: 16px;
        }
      }
      .detailsBtn {
        width: 80px;
        height: 30px;
        background: transparent;
        border: solid 1px #68c161;
        color: #68c161;
      }
      .delBtn {
        width: 80px;
        height: 30px;
        background: transparent;
        border: solid 1px #ec5555;
        color: #ec5555;
        margin-left: 20px;
      }
    }
  }
}
</style>
