<template>
<div id="system">
  <el-button type="primary" plain @click="sendSystem" :disabled="newSystem!==1">{{newSystem===1?'更新':'已更新至最新版本'}}</el-button>
  <div style="margin:20px 0">历史信息</div>
  <el-timeline>
    <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
</div>
</template>

<script>
export default {
  name: "system",
  data() {
    return {
      url: this.ipNormal + '/api/v1/',
      newSystem: 0,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    };
  },
  methods: {
    getNewSystem() {

      // this.$gAjax(`${this.url}lightCtrl/ctrl/findLightConfAreaTemp/web?${Math.random()*100}`)
      //   .then(res => {
      //     if (res.resultCode == 'success') {
      // this.initWebpack();
      //     }
      //   })["catch"](() => {});
    },
    sendSystem() {},
  },
  mounted() {
    this.getNewSystem()
  }
};
</script>

<style lang='scss'>
@import "../../assets/styles/common";
#system {
  text-align: left;
}
</style>
