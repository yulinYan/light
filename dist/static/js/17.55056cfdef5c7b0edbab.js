webpackJsonp([17],{AJOY:function(e,t){},WcXQ:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=o("mvHQ"),n=o.n(s),i=o("Gu7T"),c=o.n(i),l={name:"delLight",data:function(){return{url:this.ipNormal+"/api/v1/",data:[],value:[],filterMethod:function(e,t){return t.label.indexOf(e)>-1}}},methods:{getConfigForm:function(){var e=this;this.$gAjax(this.url+"lightAllConf/find/device_list?deviceType=web&time="+100*Math.random()).then(function(t){if("success"==t.resultCode){0==t.data.length&&e.$message({type:"info",message:"暂无可用设备"});var o=[];t.data.forEach(function(e,t){o.push({label:e.shortAddr+"("+(null==e.msg?"暂无分组":e.msg)+")",key:e.shortAddr,msg:e.msg||""})}),e.data=[].concat(c()(o)),o=null}})},del:function(){var e=this;if(this.value.length>0){var t=this;this.$confirm("此操作将永久删除该灯, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e=t.value.join("-");console.log(e),t.$pAjax(t.url+"lightAllConf/del/forever?numbers="+e).then(function(e){e.data>0&&(t.value=[],t.getConfigForm(),t.$root.Bus.$emit("showLoading",!0,"重启中，请稍后"),t.initWebpack())})}).catch(function(t){console.log(t),e.$message({type:"info",message:"已取消删除"})})}else this.$message({type:"info",message:"请选择要删除的灯"})},initWebpack:function(){this.websock="ws://"+this.ipWsMonitor+"/restartTo",this.websock=new WebSocket(this.websock),this.websock.onopen=this.websocketopen,this.websock.onmessage=this.websocketonmessage,this.websock.onclose=this.websocketclose,this.websock.onerror=this.websocketerror},websocketopen:function(){console.log("WebSocket连接成功"),this.websocketonsend()},websocketonmessage:function(e){console.log(e),e.data.includes("ws关闭")&&this.$root.Bus.$emit("showLoading",!1)},websocketonsend:function(e){this.websock&&(console.log(this.sendMsg),this.websock.send(n()({server:"pro",flag:2})))},websocketclose:function(e){console.log("WebSocket关闭"),console.log(this.checkedCities),this.getTime(),this.websock&&this.websock.close()},websocketerror:function(){console.log("WebSocket连接失败");var e=this;"#/devPageBox/delLight"==location.hash&&(window.ActiveXObject||"ActiveXObject"in window)&&setTimeout(function(){e.initWebpack(),e=null},5e3)}},mounted:function(){console.log(this.data)}},a={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"delLight"},[o("el-button",{staticClass:"operateDiv",on:{click:e.getConfigForm}},[e._v("导入")]),e._v(" "),o("div",[o("el-transfer",{attrs:{filterable:"","button-texts":["撤回","移入"],"filter-method":e.filterMethod,"filter-placeholder":"请输入id",titles:["全选","全选"],data:e.data},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}}),e._v(" "),o("el-button",{on:{click:e.del}},[e._v("删除")])],1)],1)},staticRenderFns:[]};var r=o("VU/8")(l,a,!1,function(e){o("AJOY")},null,null);t.default=r.exports}});