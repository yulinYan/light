<template>
<div class="LightRights">
  <div class="overview">
    <p class="header">
      <span>意见反馈</span>
    </p>
    <div class="suggest">
      <div class="requireDiv"><span>问题分类：</span>
        <el-checkbox-group v-model="checkList" @change="upgrade">
          <el-checkbox label="报错"></el-checkbox>
          <el-checkbox label="建议"></el-checkbox>
          <el-checkbox label="其他"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div><span style="margin: 30px 0 20px 0;display: inline-block;">问题概述：</span>
        <el-input class="sum" type="textarea" resize="none" :rows="1" v-model="sum">
        </el-input>
      </div>
      <span class="requireDiv" style="margin: 25px 0 20px 0;display: inline-block;">问题描述：</span>
      <el-input type="textarea" :rows="10" resize="none" placeholder="提出您的建议…" v-model="suggestTextarea">
      </el-input>
      <div><span style="margin-top: 30px;display: inline-block;">联系方式：</span>
        <el-input class="tel" type="textarea" resize="none" :rows="1" v-model="tel" placeholder="请输入手机或座机号码">
        </el-input>
      </div>
      <div><button @click="clearText">清除</button><button @click="saveText" v-if="show.insertFeedback">保存</button></div>
    </div>
  </div>
</div>
</template>

<script>
import {
  insertFeedback,
} from './apis/LightRights.js';
export default {
  name: "LightRights",
  data() {
    return {
      show: {
        insertFeedback: true,
      },
      suggestTextarea: '',
      checkList: [],
      tel: '',
      sum: '',
      sendAjax: false
    };
  },
  methods: {
    saveText() {
      if (!this.sendAjax) {
        if (this.suggestTextarea != '') {
          if (this.tel != '') {
            if (!(/^1[34578]\d{9}$/.test(this.tel)) && !(/^([0-9]{3,5}-)?[0-9]{7,8}$/.test(this.tel))) {
              this.$message({
                type: 'error',
                message: '联系方式有误'
              });
              return;
            }
          }
          let type = '';
          switch (this.checkList[0]) {
            case '报错':
              type = 1;
              break;
            case '建议':
              type = 2;
              break;
            case '其他':
              type = 3;
              break;
          }
          if (type == '') {
            this.$message({
              type: 'error',
              message: '请填写问题分类'
            });
            return;
          }
          let formData = new FormData();
          formData.append('introduction', this.sum)
          formData.append('type', type)
          formData.append('info', this.suggestTextarea)
          formData.append('phone', this.tel)
          formData.append('state', 0)
          this.sendAjax = true;

          this.$root.Bus.$emit("showLoading", true);
          insertFeedback(formData)
            .then(res => {
              this.sendAjax = false;
              this.$root.Bus.$emit("showLoading", false);
              if (res.resultCode == 'success') {
                formData = null;
                this.$message({
                  type: 'success',
                  message: '提交成功'
                });
                this.clearText();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            }).catch(() => {
              this.sendAjax = false;
              this.$root.Bus.$emit("showLoading", false);
            });
        } else {
          this.$message({
            type: 'error',
            message: '请提出您的建议(问题描述)'
          });
        }
      } else {
        this.$message({
          type: 'info',
          message: '正在提交，请稍后'
        });
      }
    },
    upgrade(v) {
      this.checkList = [v[v.length - 1]];
    },
    clearText() {
      this.suggestTextarea = '';
      this.checkList = [];
      this.tel = '';
      this.sum = '';
    },
  },
  mounted() {
    // let menuList = JSON.parse(sessionStorage.getItem('stringPermissions'));
    // if (menuList.includes('api:v1:feedback:insertFeedback')) {
    //   this.show.insertFeedback = true;
    // } else {
    //   this.show.insertFeedback = false;
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.LightRights {
  width: 100%;
  height: 100%;
  .requireDiv {
    position: relative;
    line-height: 19px;
    &::after {
      @include position(absolute, 0, none, 0, -12px);
      content: '*';
      color: #F56C6C;
    }
  }
  .overview {
    min-height: 604px;
    height: 100%;
    margin-bottom: 30px;
    @include media($m1366) {
      margin-bottom: 15px;
    }
    position: relative;
    .suggest {
      text-align: left;
      color: #303030;
      padding: 28px 0 0;
      font-size: 14px;
      margin-bottom: 20px;
      div:first-child {
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
      >div:last-child {
        @include position(absolute, none, none, 40px, 50%);
        transform: translateX(-50%);
        text-align: center;
        @include media($m800) {
          @include position(absolute, none, none, 14px, 50%);
        }
        button {
          width: 130px;
          height: 32px;
          background-color: #c4d4e7;
          font-size: 14px;
          color: #ffffff;
          border-radius: 4px;
          &:last-child {
            margin-left: 70px;
            @include media($m800) {
              margin-left: 4px;
            }
            background-color: #3c70d7;
          }
        }
      }
    }
    textarea.el-textarea__inner {
      background-color: #f1f3f6;
      font-size: 14px;
      border: none;
    }
    .tel {
      display: inline-block;
      width: 190px;
      vertical-align: middle;
    }
    .sum {
      width: 100%;
    }
  }
  .el-checkbox__inner {
    box-shadow: none;
    border: solid 1px #3c70d7;
    border-radius: 4px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #3c70d7;
  }
}
</style>
