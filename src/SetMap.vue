<template>
<div class="LightSet2">
  <h2>{{title}}照明设置</h2>
  <div>
    <div class="overview" :class="{ onlyOne: mapSet!='light' }">
      <div class="header">
        <button class="el-icon-arrow-left" @click="goLightSet">返回</button>
        <button class="el-icon-plus" @click="centerDialogVisible = true" v-if="mapSet=='factory'">新增</button>
        <button @click="delLight">删除</button>
        <div class="button"><span @click="showAlignChange">对齐</span>
          <div v-if="showAlign" class="showAlignDiv">
            <img v-for="(item,index) in showAlignImg" :title="item.title" :key="index" :src="item.icon" alt="" @click="alignFn(index)">
          </div>
        </div>
        <el-select v-model="lightSize" id="lightSize" placeholder="请选择">
          <el-option label="灯/区域大小:100%" value="60px">
          </el-option>
          <el-option label="灯/区域大小:80%" value="48px">
          </el-option>
          <el-option label="灯/区域大小:60%" value="36px">
          </el-option>
          <el-option label="灯/区域大小:40%" value="24px">
          </el-option>
          <el-option label="灯/区域大小:20%" value="12px">
          </el-option>
        </el-select>
        <button class="futureChecked" @click="futureCheckedChange">清除选择</button>
      </div>
      <div class="mapBox">
        <div class="map" @dragover="dragover($event)" draggable="false">
          <img :src="map" alt="" draggable="false">
          <div v-for="(src,index) in lights" draggable="true" :style="{left:src.xAxis*100+'%',top:src.yAxis*100+'%'}" :type="src.type" :addr="src.shortAddr" :key="index" @mousedown="saveE($event)" @dragend="dragend($event)">
            <el-popover v-if="mapSet=='light'" placement="top-start" trigger="hover">
              <div>
                <ul>
                  <!-- <li>段号地址号：{{src.partNumber}}</li> -->
                  <li>id：{{src.shortAddr.split('-')[0]}}</li>
                </ul>
              </div>
              <div slot="reference">
                <img :src="src.icon" alt="" :addr="src.shortAddr" :style="{width:lightSize}" @click="chooseDel(index)">
                <img src="./assets/img/LightCtrl/choose.png" alt="" v-show="src.click">
              </div>
            </el-popover>
            <div v-else-if="mapSet=='factory'">
              <img :src="factoryImg" :style="{width:lightSize}" alt="" :addr="src.shortAddr" @click="chooseDel(index)">
              <span v-if="!src.click" style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);color:#000;background:#fff;padding:2px;font-size:14px;white-space: nowrap;">{{src.shortAddr}}</span>
              <!-- <img :style="{width:chooseSize}" src="./assets/img/LightCtrl/choose.png" alt="" v-show="src.click"> -->
              <img src="./assets/img/LightCtrl/choose.png" alt="" v-show="src.click">
            </div>
          </div>
        </div>
      </div>
      <button @click="saveLights">保存</button>
    </div>
    <div class="overview setLight" v-if="mapSet=='light'&&show.shortAddrAll">
      <div class="header">
        <span>设备信息</span>
        <button @click="getConfigForm" class="getConfigForm">导入配置表</button>
      </div>
      <div class="config">
        <div>
          <el-input placeholder="输入信息查询" v-model="searchAddr" clearable>
          </el-input>
          <a href="javaScript:void(0)" @click="searchAddrBtn">查询</a>
        </div>
        <div class="lightList">
          <div>
            <p :name="item.shortAddr" v-for="(item,index) in configForm" draggable="true" :id="item.partNumber" :key="index" @dragend="dragend($event)" :class="{ active: item.active }" :zoneName="item.msg"><span v-if="item.msg!=null" style="color:#ccc">{{item.shortAddr}}({{item.msg}})</span><span v-else>{{item.shortAddr}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog :close-on-click-modal="closeclickmodal" title="新增区域" :visible.sync="centerDialogVisible" width="30%" center>
    <el-form v-if="mapSet === 'light'" ref="form" label-width="100px" label-position="left">
      <!-- <el-form-item label="段号地址号：">
        <el-input v-model="form.shortAddr"></el-input>
      </el-form-item> -->
      <el-form-item label="id：">
        <el-input v-model="form.shortAddr"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-else ref="form" :model="form" label-width="100px" label-position="left">
      <el-form-item label="区域名：">
        <el-input v-model="form.name" maxlength="20" placeholder="小于20个字符"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="save">保存</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import lightImg from './assets/img/LightCtrl/light.png';
import lightImg1 from './assets/img/LightCtrl/light-off.png';
import factoryImg from './assets/img/LightCtrl/factory.png';
import leftIcon from './assets/img/LightSet/left.png';
import topIcon from './assets/img/LightSet/top.png';
import rightIcon from './assets/img/LightSet/right.png';
import map from "./assets/img/LightCtrl/map.png";
import bottomIcon from './assets/img/LightSet/bottom.png';
import {
  onTotalArea,
  confArea,
  deviceList,
} from './apis/SetMap.js';
export default {
  name: "LightSet",
  data() {
    return {
      title: '',
      show: {
        shortAddrAll: true,
      },
      closeclickmodal: false,
      lightImg: lightImg,
      lightImg1: lightImg1,
      factoryImg: factoryImg,
      map: '',
      mapSet: '',
      configmsg: {},
      searchAddr: '',
      configForm: [],
      lights: [],
      activeLightsCalendar: [],
      lightSize: '60px',
      // chooseSize: '23px',
      centerDialogVisible: false,
      form: {
        shortAddr: '',
        name: ''
      },
      showAlign: false,
      showAlignImg: [{
        icon: leftIcon,
        title: '左对齐'
      }, {
        icon: rightIcon,
        title: '右对齐'
      }, {
        icon: topIcon,
        title: '上对齐'
      }, {
        icon: bottomIcon,
        title: '下对齐'
      }],
      sendGetConfigForm: false,
      sendSaveLights: false,
      saveXY: {
        x: 0,
        y: 0,
        t: 0
      },
      drawDivSize: {
        startX: 0,
        startY: 0,
        retcLeft: '0px',
        retcTop: '0px',
        retcHeight: '0px',
        retcWidth: '0px',
        flag: false
      }
    };
  },
  methods: {
    // imgLoad(imgurl) {
    //   let ImgObj = new Image(); //判断图片是否存在
    //   ImgObj.src = imgurl;
    //   //没有图片，则返回-1
    //   if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    //     return true;
    //   }
    //   return false;
    // },
    // lightSizeChange() {
    //   this.chooseSize = Number(this.lightSize.replace(/\s+|px/gi, "")) * 0.3 + 'px';
    // },
    showAlignChange() {
      if (this.activeLightsCalendar.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加要对齐的灯/区域'
        });
        return;
      }
      this.showAlign = !this.showAlign;
    },
    saveLights() {
      // console.log(this.lights)
      if (!this.sendSaveLights) {
        this.sendSaveLights = true;
        this.$message({
          type: 'info',
          message: '保存中,请稍后'
        });
        let lightAreaInfo = [];
        this.lights.forEach((v, i) => {
          lightAreaInfo.push({
            xAxis: v.xAxis,
            yAxis: v.yAxis,
            shortAddr: v.shortAddr,
          })
        })
        if (lightAreaInfo.length == 0) {
          this.$message({
            type: 'info',
            message: '暂无保存的信息，请点击返回按钮返回'
          });
          return;
        }
        this.$root.Bus.$emit("showLoading", true);
        let formData = new FormData();
        if (this.mapSet == 'factory') {
          formData.append('areaId', this.configmsg.id)
          formData.append('percentSize', this.lightSize)
          formData.append('areaName', this.configmsg.areaName)
          formData.append('jsonStr', JSON.stringify(lightAreaInfo))
          formData.append('deviceType', this.title)
          onTotalArea(formData)
            .then(res => {
              this.$root.Bus.$emit("showLoading", false);
              this.sendSaveLights = false;
              if (res.resultCode == 'success' && res.data >= 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                lightAreaInfo = null;
                this.goLightSet();
              } else if (res.data == -2) {
                this.$message({
                  type: 'error',
                  message: '更新失败'
                });
              } else {
                let arr = res.data.split(':')[1].split(',');
                arr.forEach((va, ia) => {
                  this.lights.forEach((v, i) => {
                    if (v.shortAddr.split('-')[0] === arr[ia]) {
                      v.icon = this.lightImg1;
                      arr.splice(arr.findIndex(item => item === arr[ia]), 1)
                    } else {
                      v.icon = this.lightImg;
                    }
                  })
                })
                // this.
                this.$message({
                  type: 'error',
                  message: 'id(' + res.data.split(':')[1] + ')已经存在，请先移除重复的值'
                });
              }
            }).catch(() => {
              this.sendSaveLights = false;
              this.$root.Bus.$emit("showLoading", false);
              this.$message({
                type: 'error',
                message: '网络连接错误'
              });
            });
        } else {
          formData.append('id', this.configmsg.id)
          formData.append('percentSize', this.lightSize)
          formData.append('areaName', this.configmsg.areaName)
          formData.append('lightAreaInfo', JSON.stringify(lightAreaInfo))
          formData.append('deviceType', this.title)
          confArea(formData)
            .then(res => {
              this.$root.Bus.$emit("showLoading", false);
              this.sendSaveLights = false;
              if (res.resultCode == 'success' && res.data >= 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                lightAreaInfo = null;
                this.goLightSet();
              } else if (res.data == -2) {
                this.$message({
                  type: 'error',
                  message: '更新失败'
                });
              } else {
                let arr = res.data.split(':')[1].split(',');
                arr.forEach((va, ia) => {
                  this.lights.forEach((v, i) => {
                    if (v.shortAddr.split('-')[0] === arr[ia]) {
                      v.icon = this.lightImg1;
                      arr.splice(arr.findIndex(item => item === arr[ia]), 1)
                    } else {
                      v.icon = this.lightImg;
                    }
                  })
                })
                // this.
                this.$message({
                  type: 'error',
                  message: 'id(' + res.data.split(':')[1] + ')已经存在，请先移除重复的值'
                });
              }
            }).catch(() => {
              this.sendSaveLights = false;
              this.$root.Bus.$emit("showLoading", false);
              this.$message({
                type: 'error',
                message: '网络连接错误'
              });
            });
        }
      } else {
        this.$message({
          type: 'info',
          message: '保存中,请稍后'
        });
      }
    },
    goLightSet() {
      this.$root.Bus.$emit("getGroupOptions", 'change');
      this.$router.push({
        path: '/LightBox/LightSet',
        query: {
          info: this.title
        }
      })
    },
    alignFn(index) {
      if (this.activeLightsCalendar.length != 0) {
        let max = 0;
        if (index == 0) {
          max = this.activeLightsCalendar[0].xAxis;
          this.activeLightsCalendar.forEach((v, i) => {
            if (v.xAxis < max) {
              max = v.xAxis;
            }
          })
          this.activeLightsCalendar.forEach((v, i) => {
            v.xAxis = max;
          })
        } else if (index == 1) {
          max = this.activeLightsCalendar[0].xAxis;
          this.activeLightsCalendar.forEach((v, i) => {
            if (v.xAxis > max) {
              max = v.xAxis;
            }
          })
          this.activeLightsCalendar.forEach((v, i) => {
            v.xAxis = max;
          })
        } else if (index == 2) {
          max = this.activeLightsCalendar[0].yAxis;
          this.activeLightsCalendar.forEach((v, i) => {
            if (v.yAxis < max) {
              max = v.yAxis;
            }
          })
          this.activeLightsCalendar.forEach((v, i) => {
            v.yAxis = max;
          })
        } else if (index == 3) {
          max = this.activeLightsCalendar[0].yAxis;
          this.activeLightsCalendar.forEach((v, i) => {
            if (v.yAxis > max) {
              max = v.yAxis;
            }
          })
          this.activeLightsCalendar.forEach((v, i) => {
            v.yAxis = max;
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '请选中要对齐的灯/区域'
        });
      }
    },
    searchAddrBtn() {
      if (this.searchAddr != '') {
        let win = 0;
        if (navigator.userAgent.indexOf("Chrome") > -1) {
          win = 5;
        } else {
          win = 17;
        }
        let h = $('.lightList').height() - win,
          h1 = $('.lightList>div').height(),
          top = 0;
        for (let i = 0; i < this.configForm.length; i++) {
          if (this.configForm[i].shortAddr.includes(this.searchAddr)) {
            if (top == 0) {
              top = i * 30;
              if (top < h) {
                top = 0;
              } else if (top > (h1 - h)) {
                top = (h1 - h);
              }
              // console.log(top)
              $('.lightList')[0].scrollTop = top;
            }
            this.configForm[i].active = true;
          } else {
            this.configForm[i].active = false;
          }
        }
        for (let i = 0; i < this.lights.length; i++) {
          if (this.lights[i].shortAddr.split('-')[0].includes(this.searchAddr)) {
            this.lights[i].icon = this.lightImg1;
          } else {
            this.lights[i].icon = this.lightImg;
          }
        }

        // this.configForm.forEach((v, i) => {
        //   if (v.shortAddr === this.searchAddr) {
        //     let top = i * 30;
        //     if (top < h) {
        //       top = 0;
        //     } else if (top > (h1 - h)) {
        //       top = (h1 - h);
        //     }
        //     // console.log(top)
        //     $('.lightList')[0].scrollTop = top;
        //     v.active = true;
        //   } else {
        //     v.active = false;
        //   }
        // })
        // this.lights.forEach((v, i) => {
        //   if (v.shortAddr.split('-')[0] === this.searchAddr) {
        //     v.icon = this.lightImg1;
        //   } else {
        //     v.icon = this.lightImg;
        //   }
        // })
      } else {
        this.configForm.forEach((v, i) => {
          $('.lightList')[0].scrollTop = 0;
          v.active = false;
        })
        this.lights.forEach((v, i) => {
          v.icon = this.lightImg;
        })
      }
    },
    save() {
      if (this.mapSet == 'light') {
        if (this.form.shortAddr) {
          console.log(this.lights)
          console.log(this.form.shortAddr)
          for (let i = 0; i < this.lights.length; i++) {
            if (this.lights[i].shortAddr == this.form.shortAddr) {
              this.$message({
                type: 'error',
                message: '您添加的灯已存在'
              });
              return;
            }
          }
          if (isNaN(this.form.shortAddr)) {
            this.$message({
              type: 'error',
              message: '请添加正确的灯信息'
            });
          } else if (this.form.shortAddr.length != 8) {
            console.log(this.form.shortAddr.length)
            console.log(this.form.shortAddr.length > 6)
            this.$message({
              type: 'error',
              message: '请添加正确的灯信息'
            });
          } else {
            this.lights.push({
              xAxis: 0 + $('.mapBox')[0].scrollLeft / $(".map").width(),
              yAxis: 0 + $('.mapBox')[0].scrollTop / $(".map").height(),
              type: this.mapSet,
              click: false,
              shortAddr: this.form.shortAddr,
              name: '',
              icon: this.lightImg
            });
            this.centerDialogVisible = false;
            this.form = {
              shortAddr: '',
              name: ''
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: '请添加正确的灯信息'
          });
        }
      } else {
        // console.log(this.form.name.indexOf('null'))
        // console.log(this.form.name.indexOf('undefined'))
        if (this.form.name.indexOf('null') != -1 || this.form.name.indexOf('undefined') != -1) {
          this.$message({
            type: 'info',
            message: '请输入正确的名称'
          });
          return;
        }
        for (let i = 0; i < this.lights.length; i++) {
          if (this.lights[i].shortAddr == this.form.name) {
            this.$message({
              type: 'error',
              message: '您添加的工厂已存在'
            });
            return;
          }
        }
        console.log($('.mapBox')[0].scrollLeft)
        this.lights.push({
          xAxis: 0 + $('.mapBox')[0].scrollLeft / $(".map").width(),
          yAxis: 0 + $('.mapBox')[0].scrollTop / $(".map").height(),
          type: this.mapSet,
          click: false,
          shortAddr: this.form.name,
          icon: this.lightImg
        });
        this.centerDialogVisible = false;
        this.form = {
          shortAddr: '',
          name: ''
        }
      }
    },
    futureCheckedChange() {
      this.lights.forEach((v, i) => {
        v.click = false;
      })
      this.activeLightsCalendar = [];
    },
    chooseDel(index) {
      // console.log(index)
      this.lights[index].click = this.lights[index].click == true ? false : true;
      if (this.lights[index].click) {
        this.activeLightsCalendar.push(this.lights[index]);
      } else {
        this.activeLightsCalendar.splice(this.activeLightsCalendar.findIndex(item => item.shortAddr === this.lights[index].shortAddr), 1)
        // this.activeLightsCalendar.splice($.inArray(this.lights[index], this.activeLightsCalendar), 1);
      }
    },
    delLight() {
      if (this.activeLightsCalendar.length === 0) {
        this.$message({
          type: 'error',
          message: '请选中要删除的灯/区域'
        });
        return;
      }
      this.$confirm('此操作将使已布好的灯/区域清除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(this.activeLightsCalendar);
        // console.log(this.lights);
        this.activeLightsCalendar.forEach((v, i) => {
          this.lights.splice(this.lights.findIndex(item => item.shortAddr === v.shortAddr), 1);
        })
        this.activeLightsCalendar = [];
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getConfigForm() {
      if (!this.sendGetConfigForm) {
        this.sendGetConfigForm = true;
        this.$root.Bus.$emit("showLoading", true);
        deviceList(this.title)
          .then(res => {
            this.$root.Bus.$emit("showLoading", false);
            this.sendGetConfigForm = false;
            if (res.resultCode == 'success') {
              if (res.data.length == 0) {
                this.$message({
                  type: 'info',
                  message: '暂无可用设备'
                });
              }
              res.data.forEach((v, i) => {
                v.active = false;
              })
              this.configForm = res.data;
            }
          }).catch(() => {
            this.sendGetConfigForm = false;
            this.$root.Bus.$emit("showLoading", false);
          });
      } else {
        this.$message({
          type: 'info',
          message: '导入中,请稍后'
        });
      }
    },
    saveE(e) {
      this.saveXY = {
        x: e.offsetX,
        y: e.offsetY,
        t: this.$moment(new Date()).valueOf()
      }
    },
    dragend(e) {
      let time = this.$moment(new Date()).valueOf();
      // console.log(e)
      // console.log(this.saveXY.t)
      // console.log(time - this.saveXY.t)
      if (time - this.saveXY.t <= 200) {
        return;
      }
      let w = $(".map").width(),
        h = $(".map").height(),
        m = 0,
        m2 = 0,
        m1 = $('.el-header').height();
      if ($('.el-main').css('padding') == '') {
        if (window.innerWidth > 1366) {
          m = 30;
          m2 = 30;
        } else {
          m = 25;
          m2 = 12;
        }
      } else {
        m2 = Number($('.el-main').css('padding').split(' ')[0].replace(/\s+|px/gi, ""));
        m = $('.el-main').css('padding').split(' ')[1] === undefined ? m2 : Number($('.el-main').css('padding').split(' ')[1].replace(/\s+|px/gi, ""));
      }
      // console.log($('.el-main')[0].scrollLeft)
      // console.log($('.el-main')[0].scrollTop)
      let x = (((e.pageX + $('.mapBox')[0].scrollLeft) - (210 + m + $('.map')[0].offsetLeft)) / w),
        y = (((e.pageY + $('.mapBox')[0].scrollTop - 24) - (m1 + m2 + 75 + $('.map')[0].offsetTop)) / h);
      // console.log(y)
      // console.log(e)
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        if (e.target.innerText != '' && e.target.innerText != undefined) {
          console.log(11111)
          if ($(e.target).attr('zoneName') == null) {
            this.lights.push({
              xAxis: x,
              yAxis: y,
              icon: this.lightImg,
              type: this.mapSet,
              click: false,
              shortAddr: e.target.innerText,
              partNumber: e.target.id
            });
            // console.log(this.configForm);
            this.configForm.splice(this.configForm.findIndex(item => item.shortAddr === e.target
              .innerText), 1);
          } else {
            this.$message({
              type: 'info',
              message: '当前灯已在其他地图中'
            });
          }
        } else {
          this.lights.forEach((v, i) => {
            if (v.shortAddr === $(e.target).attr('addr')) {
              v.xAxis = (((e.pageX + $('.mapBox')[0].scrollLeft) - (200 + m + $('.map')[0].offsetLeft) - this.saveXY.x) / w);
              v.yAxis = (((e.pageY + $('.mapBox')[0].scrollTop - 24) - (m1 + m2 + 70 + $('.map')[0].offsetTop) - this.saveXY.y) / h);
            }
          })
        }
      }
    },
    dragover(e) {
      e.preventDefault();
    },
    drawDivDown(e) {
      this.drawDivSize.flag = true;
      console.log(111)
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
      this.drawDivSize.startX = e.clientX + scrollLeft;
      this.drawDivSize.startY = e.clientY + scrollTop;
      var div = document.createElement("div");
      div.id = 'drawDiv';
      div.className = "div";
      div.style.marginLeft = this.drawDivSize.startX + "px";
      div.style.marginTop = this.drawDivSize.startY + "px";
      document.body.appendChild(div);

      console.log($('#drawDiv'))
    },
    drawDivUp(e) {
      console.log(333)
      document.body.removeChild(document.querySelector('#drawDiv'));
      // var div = document.createElement("div");
      // div.className = "retc";
      // div.style.marginLeft = retcLeft;
      // div.style.marginTop = retcTop;
      // div.style.width = retcWidth;
      // div.style.height = retcHeight;
      // document.body.appendChild(div);
      this.drawDivSize.flag = false;
    },
    drawDivOver(e) {
      if (this.drawDivSize.flag) {
        console.log(e)
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        this.drawDivSize.retcLeft = (this.drawDivSize.startX - e.clientX - scrollLeft > 0 ? e.clientX + scrollLeft : this.drawDivSize.startX) + "px";
        this.drawDivSize.retcTop = (this.drawDivSize.startY - e.clientY - scrollTop > 0 ? e.clientY + scrollTop : this.drawDivSize.startY) + "px";
        this.drawDivSize.retcHeight = Math.abs(this.drawDivSize.startY - e.clientY - scrollTop) + "px";
        this.drawDivSize.retcWidth = Math.abs(this.drawDivSize.startX - e.clientX - scrollLeft) + "px";
        console.log(this.drawDivSize.retcWidth)
        console.log(this.drawDivSize.retcHeight)
        document.querySelector('#drawDiv').style.marginLeft = this.drawDivSize.retcLeft;
        document.querySelector('#drawDiv').style.marginTop = this.drawDivSize.retcTop;
        document.querySelector('#drawDiv').style.width = this.drawDivSize.retcWidth;
        document.querySelector('#drawDiv').style.height = this.drawDivSize.retcHeight;
      }
    }
  },
  mounted() {
    if (localStorage.getItem('areaMsg') == null && this.$route.query.type) {
      // console.log(localStorage.getItem('areaMsg') == null)
      this.$router.push({
        path: '/LightBox/LightSet',
        query: {
          info: this.title
        }
      })
    } else {
      console.log(JSON.parse(sessionStorage.getItem('menuTree'))[0].children.findIndex(item => item.path === 'LightSet'))
      this.$root.Bus.$emit("goLightFault", JSON.parse(sessionStorage.getItem('menuTree'))[0].children.findIndex(item => item.path === 'LightSet'));
      this.configmsg = JSON.parse(localStorage.getItem('areaMsg'));
      this.map = map;
      let _this = this;
      let ImgObj = new Image(); //判断图片是否存在
      ImgObj.src = this.ipPix + this.configmsg.picUrlPath;
      ImgObj.onload = function() {
        _this.map = _this.ipPix + _this.configmsg.picUrlPath;
      }
      this.mapSet = this.$route.query.type;
      this.title = this.$route.query.info == 'app' ? 'app' : 'web';
      // this.showLights();
      let arr = JSON.parse(this.configmsg.lightAreaInfo) || [];
      arr.forEach((v, i) => {
        v.click = false;
        v.icon = this.lightImg;
      })
      this.lights = arr;
      // arr = null;
      this.lightSize = this.configmsg.percentSize || '60px';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.LightSet2 {
  width: 100%;
  height: 100%;
  h2 {
    height: 24px;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  >div {
    height: calc(100% - 34px);
  }
  .overview {
    width: calc( 100% - 330px);
    height: 100%;
    overflow-y: auto;
    overflow-x: visible;
    position: relative;
    padding: 0 20px 30px;
    float: left;
    &.onlyOne {
      width: 100%;
    }
    &.setLight {
      width: 300px;
      margin-top: 0px;
      float: right;
      height: 100%;
    }
    .header {
      text-align: left;
      padding: 0 20px;
      margin: 0 -20px;
      @include position(relative, none, none, none, none);
      @include media($m1440) {
        font-size: 14px;
      }
      >span {
        font-weight: bold;
      }
      button,
      .button {
        position: relative;
        width: 80px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        background-color: #f2f4f6;
        border-radius: 4px;
        margin-right: 15px;
        @include media($m800) {
          margin-right: 2px;
        }
        font-size: 14px;
        color: #505050;
        &:first-child {
          background-color: #3c70d7;
          color: #fff;
        }
        >span {
          display: block;
          width: 100%;
          font-weight: normal;
        }
      }
      .getConfigForm {
        width: 110px;
        color: #fff;
        float: right;
        background-color: #3c70d7;
        display: block;
        margin: 9px 0 0 0;
      }
      .el-select {
        width: 170px;
        height: 32px;
        position: relative;
        top: 11px;
        .el-input {
          height: 32px;
          input {
            float: left;
            height: 32px;
            line-height: 32px;
            border: none;
            background-color: #f2f4f6;
            border-radius: 4px;
          }
        }
        .el-select__caret {
          float: right;
          line-height: 32px;
        }
      }
      .showAlignDiv {
        width: 150px;
        height: 32px;
        background-color: #ffffff;
        @include position(absolute, none, none, -34px, 0);
        z-index: 9;
        display: flex;
        justify-content: space-around;
        align-items: center;
        img {
          width: 17px;
          height: 16px;
          cursor: pointer;
        }
      }
      .futureChecked {
        margin-left: 15px;
      }
    }
    .mapBox {
      position: absolute;
      width: calc(100% - 35px);
      overflow-y: auto;
      overflow-x: visible;
      height: calc(100% - 135px);
      +button {
        position: absolute;
        bottom: 22px;
        left: 50%;
        margin-left: -65px;
        width: 130px;
        height: 32px;
        background: #3c70d7;
        font-size: 14px;
        color: #ffffff;
        margin-top: 20px;
        border-radius: 4px;
      }
    }
    .map {
      position: relative;
      display: inline-block;
      overflow-y: auto;
      overflow-x: visible;
      border-bottom: 1px solid #d8d8d8; // width: 100%;
      >div {
        position: absolute;
        img {
          cursor: pointer;
        }
        img+img {
          display: block;
          margin: 0 auto;
          z-index: 2;
          position: relative;
        }
      }
      >img {
        max-width: 100%;
        transform: translate3d(0, 0, 0);
        height: auto;
        display: block; // margin: 0 auto;
      }
    }
    .config {
      height: calc( 100% - 72px);
      >div:first-child {
        clear: both;
        height: 30px;
        margin: 12px 0 16px 0;
        .el-input {
          float: left;
          width: 184px;
        }
        input {
          height: 30px;
          line-height: 30px;
          border: none;
          background-color: #d8e0e5;
          float: left;
          width: 184px;
          border-radius: 4px;
        }
        div+a {
          width: 68px;
          height: 30px;
          line-height: 30px;
          background: #3c70d7;
          font-size: 14px;
          color: #ffffff;
          float: right;
          vertical-align: middle;
          border-radius: 4px;
        }
      }
      .lightList {
        width: 90%;
        margin: 0 auto;
        height: calc( 100% - 58px);
        overflow: auto;
        position: relative;
        div {
          @include position(absolute, 0, 0, none, 0);
          p {
            display: block;
            font-size: 14px;
            line-height: 30px;
            color: #303030;
            text-align: left;
            cursor: pointer;
            &.active {
              color: #3c70d7;
              font-weight: bold;
              span {
                color: #3c70d7 !important;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
