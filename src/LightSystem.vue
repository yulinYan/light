<template>
<!-- 系统设置 -->
<div class="LightSystem">
  <div class="overview">
    <p class="header">
      <span>项目设置</span>
    </p>
    <div class="interface">
      <span>登录logo</span>
      <div class="fileList">
        <div>
          <div style="display:inline-block;box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);background-color:rgba(204, 204, 204, 0.14)"><img :src="logo" alt=""></div>
          <div class="button">浏览<input id="setLogo" type="file" accept="image/jpg,image/png" style="width: 100%;height: 100%;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setLogo('setLogo','logo')"></div><span>仅支持JPG、PNG格式，图片小于1M</span></div>
      </div>
      <span>登录背景</span>
      <div class="fileList">
        <div>
          <div style="display:inline-block;box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);background-color:rgba(204, 204, 204, 0.14)"><img :src="webMaps" alt=""></div>
          <div class="button">浏览<input id="setwebMaps" type="file" accept="image/jpg,image/png,image/jpeg" style="width: 100%;height: 100%;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setLogo('setwebMaps','webMaps')"></div><span>仅支持JPG、PNG、jpeg格式，图片小于1M</span></div>
      </div>
      <span>ico</span>
      <div class="fileList">
        <div>
          <div style="display:inline-block;box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);background-color:rgba(204, 204, 204, 0.14)"><img style="height:16px" :src="icoIcon" alt=""></div>
          <div class="button" :style="{'margin-left':icoIcon == ''?'0':'20px'}">浏览<input id="seticoIcon" type="file" accept="image/x-icon" style="width: 100%;height: 100%;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setLogo('seticoIcon','icoIcon')"></div><span>仅支持ico格式，图片小于1M</span></div>
      </div>
      <span>项目标题</span>
      <div id="editor"></div>
      <span>导航栏</span>
      <div class="fileList">
        <div>
          <div style="box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);width:228px;overflow:hidden;display:inline-block;vertical-align: middle;"><img :src="daohanglan1920" alt="">
          </div>
          <div class="button">浏览<input id="setDaohanglan" type="file" accept="image/jpg,image/png" style="width: 100%;height: 100%;opacity: 0;position: absolute;left: 0;top: 0;z-index:999" @change="setLogo('setDaohanglan','daohanglan1920')"></div><span>仅支持JPG、PNG格式，图片小于1M</span></div>
      </div>
      <div>
        <button @click="saveEditor" v-if="show.updateUserDefined||show.insertUserDefined">保存</button></div>
    </div>
  </div>
</div>
</template>

<script>
import Editor from 'wangeditor';
import msgIcon from '@/assets/img/login/logo.png';
import icoIcon from '@/assets/img/login/ico.png';
import daohanglan1920 from '@/assets/img/LightBox/logo.png';
import webMaps from '@/assets/img/login/bg.png';
// 接口
import {
  getUserDefined,
} from './apis/login.js';
import {
  updateUserDefined,
  insertUserDefined
} from './apis/LightSystem.js';
export default {
  name: "LightSystem",
  data() {
    return {
      show: {
        getUserDefined: true,
        insertUserDefined: true,
        updateUserDefined: true
      },
      version: '',
      checkList: [],
      logo: msgIcon,
      icoIcon: icoIcon,
      daohanglan1920: daohanglan1920,
      webMaps: '',
      editor: '',
      ifUpdate: -1,
      sendAjax: false
    };
  },
  methods: {
    convertImgToBase64(url, callback, outputFormat) {
      var canvas = document.createElement('CANVAS'),
        　　ctx = canvas.getContext('2d'),
        　　img = new Image;　　
      img.crossOrigin = 'Anonymous';　　
      img.onload = function() {　　
        canvas.height = img.height;　　
        canvas.width = img.width;　　
        ctx.drawImage(img, 0, 0);　　
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');　　
        callback.call(this, dataURL);　　
        canvas = null;
      };　　
      img.src = url;
    },
    b64EncodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    getInterface() {
      this.$root.Bus.$emit("showLoading", true);
      getUserDefined()
        .then(res => {
          this.$root.Bus.$emit("showLoading", false);
          if (res.resultCode == 'success' && res.data) {
            this.logo = res.data.logow == null ? msgIcon : this.b64EncodeUnicode(res.data.logow);
            this.icoIcon = res.data.headerMap == null ? icoIcon : this.b64EncodeUnicode(res.data.headerMap);
            this.webMaps = res.data.webMaps == null ? webMaps : this.b64EncodeUnicode(res.data.webMaps);
            this.editor.txt.html(res.data.titleStyle);
            this.daohanglan1920 = res.data.logon1 == null ? daohanglan1920 : this.b64EncodeUnicode(res.data.logon1);
            this.ifUpdate = res.data.id == 0 ? -1 : res.data.id;
            this.bigPng();
          }
        }).catch(() => {
          this.$root.Bus.$emit("showLoading", false);
          this.bigPng();
        });
    },
    bigPng() {
      if (this.webMaps == '') {
        let _this = this;
        this.convertImgToBase64(webMaps, function(base64Img) {
          //转化后的base64
          _this.webMaps = base64Img;
          console.log(_this.webMaps)
        });
      }
      if (this.icoIcon == '') {
        let _this = this;
        this.convertImgToBase64(icoIcon, function(base64Img) {
          //转化后的base64
          _this.icoIcon = icoIcon;
          console.log(_this.icoIcon)
        });
      }
    },
    upgrade(v) {
      this.checkList = [v[v.length - 1]];
    },
    saveVersion() {
      if (this.checkList.length === 0 || this.checkList[0] == undefined) {
        this.$message({
          type: 'error',
          message: '请选择升级策略!'
        });
      } else {
        // console.log(this.checkList)
      }
    },
    setLogo(index, prop) {
      let img = $("#" + index)[0].files[0];
      let _this = this;
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
          _this[prop] = this.result;
          // console.log(this.result)
        };
        reader.readAsDataURL(img);
      } else {
        this.$message({
          type: 'error',
          message: '请选择图片!'
        });
      }
    },
    saveEditor() {
      if (!this.sendAjax) {
        if (this.editor.txt.html() == '<p><br></p>') {
          this.$message({
            type: 'error',
            message: '请填写项目标题!'
          });
        } else {
          // console.log(this.editor.txt.html())
          // console.log(this.logo)
          let formData = new FormData();
          formData.append('logow', this.logo)
          formData.append('titleStyle', this.editor.txt.html())
          formData.append('logon1', this.daohanglan1920)
          // formData.append('logon2', this.daohanglan1440)
          formData.append('webMaps', this.webMaps)
          formData.append('headerMap', this.icoIcon)
          if (!isNaN(this.ifUpdate) && this.ifUpdate > 0) {
            if (!this.show.updateUserDefined) {
              this.$message({
                type: 'success',
                message: '请获取修改权限'
              });
            } else {
              this.$root.Bus.$emit("showLoading", true);
              this.sendAjax = true;
              formData.append('id', this.ifUpdate)
              updateUserDefined(formData)
                .then(res => {
                  this.sendAjax = false;
                  this.$root.Bus.$emit("showLoading", false);
                  if (res.resultCode == 'success') {
                    formData = null;
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.getInterface();
                  }
                }).catch(() => {
                  this.sendAjax = false;
                  this.$message({
                    type: 'error',
                    message: '添加失败'
                  });
                });
            }
          } else {
            if (!this.show.insertUserDefined) {
              this.$message({
                type: 'success',
                message: '请获取新增权限'
              });
            } else {
              this.sendAjax = true;
              this.$root.Bus.$emit("showLoading", true);
              insertUserDefined(formData)
                .then(res => {
                  this.sendAjax = false;
                  this.$root.Bus.$emit("showLoading", false);
                  if (res.resultCode == 'success') {
                    formData = null;
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.getInterface();
                  }
                }).catch(() => {
                  this.sendAjax = false;
                  this.$message({
                    type: 'error',
                    message: '添加失败'
                  });
                });
            }
          }
        }
      } else {
        this.$message({
          type: 'info',
          message: '正在提交，请稍后'
        });
      }
    }
  },
  mounted() {
    this.editor = new Editor('#editor');
    this.editor.customConfig.menus = [
      'bold',
      'fontSize',
      'fontName',
      'foreColor'
    ];
    this.editor.customConfig.fontNames = [
      '微软雅黑',
      '宋体',
      '楷体',
    ];
    this.editor.customConfig.colors = [
      '#000000',
      '#2c5ac2',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ccc'
    ];
    this.editor.create();
    this.getInterface();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.LightSystem {
  width: 100%;
  height: 100%;
  .overview {
    height: 100%;
    min-height: 616px;
    margin-bottom: 30px;
    @include media($m1366) {
      margin-bottom: 15px;
    }
    .upgrade,
    .interface {
      text-align: left;
      color: #303030;
      padding: 28px 0 0;
      font-size: 14px;
      >p {
        margin-bottom: 20px;
        &+div {
          >span {
            margin-right: 40px;
          }
          .el-checkbox-group {
            display: inline-block;
            label {
              margin-right: 50px;
            }
          }
        }
      }
      >div:last-child {
        margin: 30px auto 0;
        @include media($m1680) {
          margin: 18px auto 0;
        }
        @include media($h800) {
          margin: 8px auto 0;
        }
        text-align: center;
        button {
          width: 130px;
          height: 32px;
          background-color: #1f6ed4;
          font-size: 14px;
          color: #ffffff;
          &:last-child {
            margin-left: 70px;
            background-color: #1f6ed4;
            border-radius: 4px;
          }
        }
      }
    }
    .interface {
      .fileList {
        margin: 20px 0 30px 0;
        @include media($m1366) {
          margin: 8px 0 30px 0;
        }
        @include media($h800) {
          margin: 8px 0 15px 0;
        }
        img {
          height: 43px;
          vertical-align: middle;
        }
        .button {
          width: 80px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          display: inline-block;
          background-color: #64b2ff;
          border-radius: 4px;
          font-size: 14px;
          color: #ffffff;
          margin: 0 20px;
          @include media($m1024) {
            margin: 0 10px;
          }
          position: relative;
        }
        span {
          font-size: 12px;
          color: #a8a8a8;
        }
      }
      >div:last-child button:last-child {
        margin-left: 0px;
      }
      >span {
        font-size: 14px;
        color: #303030;
      }
      #editor {
        margin: 10px 0 30px 0;
        border-radius: 4px;
        .w-e-text-container {
          height: 114px !important;
          z-index: 1 !important;
          @include media($m1680) {
            height: 100px !important;
          }
          border: none !important;
          .w-e-text {
            background-color: #f2f5fa;
          }
        }
        .w-e-toolbar {
          border: none !important;
          background-color: #f1f1f1 !important;
        }
      }
    }
    textarea.el-textarea__inner {
      background-color: #f0f4fb;
      font-size: 14px;
    }
  }
  .el-checkbox__inner {
    box-shadow: none;
    border: none;
    border: solid 1px #3497ff;
    border-radius: 4px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #496fec;
  }
}
</style>
