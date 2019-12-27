<template>
<!-- 照明控制 -->
<div class="LightCtrl">
  <!-- tab栏 -->
  <div class="tabDiv">
    <span v-for="(item,index) in tab" :key="index" :class="{current:item.current}" @click="changeTab(index)">{{item.name}}</span>
  </div>
  <!-- 分组全选按钮 -->
  <div style="width:100%;height:calc(100% - 70px)">
    <div class="ctrl">
      <button class="el-icon-plus" @click="creatGroup" v-if="tabIndex == 0&&show.categorySave">创建分组</button>
      <el-select v-model="groupingValue" id="groupingValue" v-if="tabIndex != 2&&tabIndex != 3&&show.categoryList" clearable placeholder="选择分组" @change="groupChange">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id+'+'+item.devices" :id="item.devices">
        </el-option>
      </el-select>
      <button class="el-icon-delete" v-if="tabIndex == 0&&groupingValue!=''&&show.categoryRemove" @click="delgroup">删除该分组</button>
      <div class="futureChecked" v-if="tabIndex != 2&&tabIndex != 3">
        <el-checkbox id="futureChecked" v-model="futureChecked" @change="futureCheckedChange">全选</el-checkbox>
      </div>
      <div class="futureChecked" v-if="tabIndex != 2&&tabIndex != 3">
        <el-checkbox id="futureChecked" v-model="futureFalseChecked" @change="futureFalseCheckedChange">反选</el-checkbox>
      </div>
      <div class="showDetailChecked" v-if="tabIndex === 1">
        <el-checkbox id="showDetailChecked" v-model="showDetailChecked" @change="showDetailCheckedChange">显示详情</el-checkbox>
      </div>
      <div class="hotMapSevenChecked" v-if="tabIndex === 3">
        <el-checkbox id="hotMapSevenChecked" v-model="hotMapSevenChecked" @change="hotMapSevenCheckedChange">七天热力图</el-checkbox>
      </div>
      <button v-if="activeLightsCalendar.length != 0&&tabIndex != 2" @click="cancalActive" class="cancalActive">清除选择</button>
      <img v-if="tabIndex !== 1" src="./assets/img/LightCtrl/state.png" alt="">
      <img v-else src="./assets/img/LightCtrl/zhuangtai.png" alt="">
      <ul class="fr" v-if="tabIndex == 1&&showDetailChecked">
        <li>L<span>激活亮度</span></li>
        <li>UL<span>未激活亮度</span></li>
        <li>T<span>感应时间</span></li>
      </ul>
    </div>
    <!-- 地图 -->
    <div class="cardDiv">
      <div class="LightMap" v-show='!hotMapSevenChecked'>
        <div id="normalMap">
          <img id="mapChange" class="speedUp" ref="speedUp" style="max-width:100%;height:auto;" :style="{'filter':showDetailChecked?'blur(4px)':'blur(0px)'}" :src='map' />
          <div v-for="(src,index) in lights" :style="{left:src.xAxis*100+'%',top:src.yAxis*100+'%'}" :type="src.type" :key="index">
            <div v-if="tabIndex==2">
              <!-- {{src.shortAddr}} -->
              <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-if="src.powerState==1" :src="lightImg1" alt="" click='false' :ref="index" :index="index" @click="showChildren(index,src)">
              <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-else-if="src.powerState==0" :src="lightImg0" alt="" click='false' :ref="index" :index="index" @click="showChildren(index,src)">
              <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-else-if="src.powerState==2" :src="lightImg2" alt="" click='false' :ref="index" :index="index" @click="showChildren(index,src)">
              <img class="chooseImg" src="./assets/img/LightCtrl/choose.png" alt="">
            </div>
            <div v-else-if="tabIndex==1">
              <!-- {{src.shortAddr}} -->
              <div v-if="src.powerState==1" @click="showChildren(index)" :id="`lightsImg${src.shortAddr}`" click='false' :ref="index">
                <!-- 普通 -->
                <img class="lightsImg" :style="{width:lightSize,'opacity':showDetailChecked?'.2':'1'}" click='false' v-if="src.state==0" :src="lightImg1" :index="index" alt="">
                <!-- 有人 -->
                <img class="lightsImg lightImgYRON1" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel!=''" :src="lightImgYRON1"
                  click='false' :index="index" alt="">
                <!-- 人感 -->
                <img class="lightsImg lightImgYRON0" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel==''" :src="lightImgYRON0"
                  click='false' :index="index" alt="">
                <img :style="{'opacity':showDetailChecked?'.4':'1'}" class="chooseImg" src="./assets/img/LightCtrl/choose.png" alt="">
                <ul v-if="showDetailChecked">
                  <li>L：{{src.indBright}}</li>
                  <li>UL：{{src.unindBright}}</li>
                  <li>T：{{src.indTime}}</li>
                </ul>
              </div>
              <div v-else-if="src.powerState==0" @click="showChildren(index)" :id="`lightsImg${src.shortAddr}`" :ref="index">
                <img class="lightsImg " :style="{width:lightSize,'opacity':showDetailChecked?'.2':'1'}" v-if="src.state==0" :src="lightImg0" :index="index" click='false' alt="">
                <img class="lightsImg lightImgYROFF1" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel!=''" :src="lightImgYROFF1"
                  click='false' :index="index" alt="">
                <img class="lightsImg lightImgYROFF0" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel==''" :src="lightImgYROFF0"
                  click='false' :index="index" alt="">
                <img :style="{'opacity':showDetailChecked?'.4':'1'}" class="chooseImg" src="./assets/img/LightCtrl/choose.png" alt="">
                <ul v-if="showDetailChecked">
                  <li>L：{{src.indBright}}</li>
                  <li>UL：{{src.unindBright}}</li>
                  <li>T：{{src.indTime}}</li>
                </ul>
              </div>
              <div v-else-if="src.powerState==2" @click="showChildren(index)" :id="`lightsImg${src.shortAddr}`" :ref="index">
                <img class="lightsImg" :style="{width:lightSize,'opacity':showDetailChecked?'.2':'1'}" v-if="src.state==0" :src="lightImg2" :index="index" click='false' alt="">
                <img class="lightsImg lightImgYRLX1" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel!=''" :src="lightImgYRLX1"
                  click='false' :index="index" alt="">
                <img class="lightsImg lightImgYRLX0" :style="{width:Number(lightSize.replace('px',''))>36?'calc('+lightSize+' + 7px)':'calc('+lightSize+' + 4px)','opacity':showDetailChecked?'.2':'1'}" v-else-if="src.state==1&&src.peopleFeel==''" :src="lightImgYRLX0"
                  click='false' :index="index" alt="">
                <img :style="{'opacity':showDetailChecked?'.4':'1'}" class="chooseImg" src="./assets/img/LightCtrl/choose.png" alt="">
                <ul v-if="showDetailChecked">
                  <li>L：{{src.indBright}}</li>
                  <li>UL：{{src.unindBright}}</li>
                  <li>T：{{src.indTime}}</li>
                </ul>
              </div>
            </div>
            <el-popover v-else placement="top" :visible-arrow="false" trigger="hover">
              <div>
                <ul>
                  <li>id：{{src.shortAddr}}</li>
                </ul>
              </div>
              <div slot="reference">
                <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-if="src.powerState==1" :src="lightImg1" alt="" click='false' :ref="index" @click="showChildren(index,src)" :index="index">
                <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-else-if="src.powerState==0" :src="lightImg0" alt="" click='false' :ref="index" @click="showChildren(index,src)" :index="index">
                <img class="lightsImg" :id="`lightsImg${src.shortAddr}`" :style="{width:lightSize}" v-else-if="src.powerState==2" :src="lightImg2" alt="" click='false' :ref="index" @click="showChildren(index,src)" :index="index">
                <img class="chooseImg" src="./assets/img/LightCtrl/choose.png" alt="">
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div v-show="hotMapSevenChecked" id="hotMapSevenMap"></div>
    </div>
  </div>
  <!-- 侧边栏 -->
  <div class="ctrlBox" v-if="tabIndex==0&&show.switch">
    <transition name="btnMove" @after-leave="btnMoveAfterLeave">
      <div v-if="ctrlBox.btnShow" @click="btnTrans" class="btn" title="基本控制"></div>
    </transition>
    <transition name="sideMove" @after-leave="sideMoveAfterLeave">
      <div v-if="ctrlBox.sideShow" class="side">
        <ul>
          <li @click="sideTrans"><img :src="hideSide" alt=""></li>
          <li>基本控制</li>
          <li>
            <div class="fl">开关</div>
            <div style="display:flex;justify-content: space-around;align-items:center;height: 100%;">
              <span @click="changeLightStates('开关','ON')" :class="{click:lightCtrlClick.openClick}"></span>
              <span @click="changeLightStates('开关','OFF')" :class="{click:lightCtrlClick.closeClick}"></span>
            </div>
          </li>
          <li style="position:relative">
            <div style="position:absolute;top:50%;transform:translateY(-50%);line-height:20px" v-if="activeLightsCalendar.length>1" class="fl">平均<br/>亮度</div>
            <div v-else class="fl">亮度</div>
            <div class="brightness">
              <el-slider v-model="lightCtrl.sliderValue1" @change="changeLightStates('亮度',lightCtrl.sliderValue1,$event)"></el-slider>
              <span>{{lightCtrl.sliderValue1}}%</span>
            </div>
          </li>
          <li>
            <div style="width:100%">预设亮度</div>
            <div class="default-brightness">
              <span @click="changeLightStates('预设亮度','25')" :class="{click:lightCtrlClick.default25}"></span>
              <span @click="changeLightStates('预设亮度','50')" :class="{click:lightCtrlClick.default50}"></span>
              <span @click="changeLightStates('预设亮度','75')" :class="{click:lightCtrlClick.default75}"></span>
              <span @click="changeLightStates('预设亮度','100')" :class="{click:lightCtrlClick.default100}"></span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <!-- 人感侧边栏 -->
  <div class="ctrlBox ctrlBoxRG" v-if="tabIndex==1&&show.peoplefeeling">
    <transition name="btnMoveRG" @after-leave="btnMoveAfterLeaveRG">
      <div v-if="ctrlBoxRG.btnShow" @click="btnTransRG" class="btn" title="人感"></div>
    </transition>
    <transition name="sideMoveRG" @after-leave="sideMoveAfterLeaveRG">
      <div v-if="ctrlBoxRG.sideShow" class="side">
        <ul>
          <li @click="sideTransRG"><img :src="hideSide" alt=""></li>
          <li style="cursor:pointer" title="未激活亮度不能大于激活亮度、感应时间不能为0">人感</li>
          <li>
            <div class="fl">开关</div>
            <div style="display:flex;justify-content: space-around;align-items:center;height: 100%;">
              <span @click="changeLightStates('人感开关','ON')" :class="{click:lightCtrlClick.openClick}"></span>
              <span @click="changeLightStates('人感开关','OFF')" :class="{click:lightCtrlClick.closeClick}"></span>
            </div>
          </li>
          <li>
            <div class="fl">激活亮度</div>
            <div class="brightness">
              <el-slider v-model="lightCtrl.sliderValue2" @change="changeLightStates('激活亮度',lightCtrl.sliderValue2)"></el-slider>
              <span>{{lightCtrl.sliderValue2}}%</span>
            </div>
          </li>
          <li>
            <div class="fl">未激活亮度</div>
            <div class="brightness">
              <el-slider v-model="lightCtrl.sliderValue3" @change="changeLightStates('未激活亮度',lightCtrl.sliderValue3)"></el-slider>
              <span>{{lightCtrl.sliderValue3}}%</span>
            </div>
          </li>
          <li>
            <div class="fl">感应时间</div>
            <div>
              <input type="number" v-model="lightCtrl.numberValue" @change="changeLightStates('感应时间',lightCtrl.numberValue)"><span>s</span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <!-- 小地图 -->
  <transition name="btnMoveOverview" @after-leave="btnMoveAfterLeaveOverview">
    <div v-if="ctrlOverview.btnShow&&factory.length>1" @click="btnTransOverview" class="overviewmapicon" title="缩略图"></div>
  </transition>
  <transition name="sideMoveOverview" @after-leave="sideMoveAfterLeaveOverview">
    <div v-if="ctrlOverview.sideShow&&factory.length>1" class="mapOverview">
      <i title="显示/隐藏缩略图" @click="sideTransOverview"></i>
      <img :src="mapOverview" alt="">
      <div>
        <div v-for="(src,index) in factory" :style="{position:'absolute',left:src.xAxis*100+'%',top:src.yAxis*100+'%'}" :key="index">
          <el-popover placement="top" :visible-arrow="false" trigger="hover">
            <div>
              <span v-if="src.current">当前区域：</span>{{src.shortAddr}}
            </div>
            <div slot="reference" style="position:relative" :style="{zIndex:src.current?1:'none'}">
              <img v-if="src.current" :src="downGif" alt="" style="position:absolute;width:14px;
              left:50%;transform:translate(-50%,-10px)">
              <img :src="src.current?factoryImg:factoryImg1" :style="{width:factorySize,display: 'block',cursor:'pointer'}" @click="changeFactory(src,index)" alt="">
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </transition>
  <!-- 热力图弹出框 -->
  <el-dialog :title="titleEnergy" @close="cancle" :visible.sync="centerDialogVisible" center :close-on-click-modal="closeclickmodal" :lock-scroll="true">
    <div slot="title" class="dialog-header">
      <span>{{titleEnergy.split('(')[0]}}</span>({{titleEnergy.split('(')[1]}}
    </div>
    <div v-show="tabIndex == 2">
      <div class="RightOne">
        <div class="RightCon" id="chart1"></div>
        <div class="RightCon" id="chart2"></div>
        <div class="RightCon" id="chart3"></div>
      </div>
      <div class="RightTwo">
        <div class="LightTop eneryAn">能耗分析</div>
        <div class="energyChart" id="chart4"></div>
      </div>
    </div>
    <div v-show='tabIndex != 2&&!hotMapSevenChecked'>
      <el-table :data="tableData" stripe style="width: 100%;padding:30px 0" :cell-style="cellStyle" :header-cell-style="headerStyle" max-height="440">
        <el-table-column prop="upTime" label="上线时间">
          <template slot-scope="scope">
<span>{{scope.row.upTime!=null?scope.row.upTime.split(' ')[0]:scope.row.upTime}}</span>
<br/>
<span>{{scope.row.upTime!=null?scope.row.upTime.split(' ')[1]:scope.row.upTime}}</span>
</template>
        </el-table-column>

        <el-table-column prop="msgCount" label="消息总量">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="upCountTime" label="上线累计时间">
        </el-table-column>
 <el-table-column prop="lastMsgTime" label="最后通信时间">
<template slot-scope="scope">
<span>{{scope.row.lastMsgTime!=null?scope.row.lastMsgTime.split(' ')[0]:scope.row.lastMsgTime}}</span>
<br/>
<span>{{scope.row.lastMsgTime!=null?scope.row.lastMsgTime.split(' ')[1]:scope.row.lastMsgTime}}</span>
</template>
        </el-table-column>
        <el-table-column prop="line" label="是否在线" width="100">
<template slot-scope="scope">
 {{Boolean(scope.row.line)?'在线':'离线'}}
</template>
        </el-table-column>
        <el-table-column prop="historyInfo" label="历史连接信息" width="200">
<template slot="header" slot-scope="scope">
<div style="cursor:pointer" title="S:初次上线时间、T:上线累计时间(s)、N:消息总量、L:最后在线时间">
  历史连接信息<span class="el-icon-question"></span>
</div>
</template>

<template slot-scope="scope" v-if="scope.row.historyInfo!=null">
<div v-for="item in scope.row.historyInfo" :key="item">
  <span title="初次上线时间">S：{{item.split('&')[0]}}</span> <br/>
  <span title="上线累计时间">T：{{item.split('&')[1]}}</span> <br/>
  <span title="消息总量">N：{{item.split('&')[2]}}</span> <br/>
  <span title="最后在线时间">L：{{item.split('&')[3]}}</span>
  <hr v-show="scope.row.historyInfo.length!=1" />
</div>
</template>
        </el-table-column>
      </el-table>
    </div>
        <div v-show='tabIndex != 2&&hotMapSevenChecked'>
      <el-table :data="tableDataSeven" stripe style="width: 100%;padding:30px 0" :cell-style="cellStyle" :header-cell-style="headerStyle"  max-height="440">
         <el-table-column prop="UpTime" label="上线时间">
<template slot-scope="scope">
<span>
  {{scope.row.UpTime!=null?scope.row.UpTime.split(' ')[0]:scope.row.UpTime}}</span>
<br/>
<span>{{scope.row.UpTime!=null?scope.row.UpTime.split(' ')[1]:scope.row.UpTime}}</span>
</template>
        </el-table-column>
        <el-table-column prop="MsgCount" label="消息总量">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="UpCountTime" label="上线累计时间">
        </el-table-column>
        <el-table-column prop="LastMsgTime" label="最后通信时间">
<template slot-scope="scope">
<span>
  {{scope.row.LastMsgTime!=null?scope.row.LastMsgTime.split(' ')[0]:''}}</span>
<br/>
<span>{{scope.row.LastMsgTime!=null?scope.row.LastMsgTime.split(' ')[1]:''}}</span>
</template>
        </el-table-column>
        <el-table-column prop="IsLine" label="是否在线" width="100">
<template slot-scope="scope">
 {{Boolean(scope.row.IsLine)?'在线':'离线'}}
</template>
        </el-table-column>
        <el-table-column width="200">
<template slot="header" slot-scope="scope">
<div style="cursor:pointer" title="S:初次上线时间、T:上线累计时间(s)、N:消息总量、L:最后在线时间">
  历史连接信息<span class="el-icon-question"></span>
</div>
</template>

<template slot-scope="scope" v-if="scope.row.HistoryInfo!=null">
<div v-for="item in scope.row.HistoryInfo" :key="item" style="cursor:pointer">
  <span title="初次上线时间">S：{{item.split('&')[0]}}</span> <br/>
  <span title="上线累计时间">T：{{item.split('&')[1]}}</span> <br/>
  <span title="消息总量">N：{{item.split('&')[2]}}</span> <br/>
  <span title="最后在线时间">L：{{item.split('&')[3]}}</span>
  <hr v-show="scope.row.HistoryInfo.length!=1" />
</div>
</template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</div>
</template>

<script>
import lightImg1 from './assets/img/LightCtrl/light.png';
import lightImg0 from './assets/img/LightCtrl/light-off.png';
import lightImg2 from './assets/img/LightCtrl/light-lx.png';
import lightImgYRLX0 from './assets/img/LightCtrl/rengan-lx.png';
import lightImgYRLX1 from './assets/img/LightCtrl/youren-lx.png';
import lightImgYROFF0 from './assets/img/LightCtrl/rengan-off.png';
import lightImgYROFF1 from './assets/img/LightCtrl/youren-off.png';
import lightImgYRON0 from './assets/img/LightCtrl/rengan-on.png';
import lightImgYRON1 from './assets/img/LightCtrl/youren-on.png';
import factoryImg from './assets/img/LightCtrl/factory.png';
import factoryImg1 from './assets/img/LightCtrl/factory1.png';
import map from './assets/img/LightCtrl/map.png';
import hideSide from './assets/img/LightCtrl/hideSide.png';
import downGif from './assets/img/LightCtrl/5bdd8ac97daceralctbivsf.gif';
import Highcharts from 'highcharts';
import echarts from 'echarts';
// import Heatmap from 'heatmap.js';
// 接口
import {
  findLightCategory,
  currentThermalDiagram,
  switchFn,
  peoplefeel,
  weekThermalDiagram,
  ThermalDiagramofDay,
  removeLightCategory,
  findLightConfAreaTemp,
  analyse,
  saveLightCategory
} from './apis/LightCtrl.js';
import {
  setInterval,
  clearInterval
} from 'timers';
export default {
  name: "LightCtrl",
  data() {
    return {
      downGif: downGif,
      lightImgYRLX0: lightImgYRLX0,
      lightImgYRLX1: lightImgYRLX1,
      lightImgYROFF0: lightImgYROFF0,
      lightImgYROFF1: lightImgYROFF1,
      lightImgYRON0: lightImgYRON0,
      lightImgYRON1: lightImgYRON1,
      show: {
        categoryList: true,
        categoryRemove: true,
        categorySave: true,
        peoplefeeling: true,
        switch: true,
        zoneList: true,
        analyse: true
      },
      ifFirstWs: {
        flag: true,
        Tk: 0
      },
      tab: [{
          name: '基本控制',
          current: true,
        },
        {
          name: '人感控制',
          current: false,
        },
        {
          name: '能源管理',
          current: false,
        },
        // {
        //   name: '在线监测',
        //   current: false,
        // }
      ],
      tabIndex: 0,
      groupOptions: [],
      groupingValue: '',
      msgOptions: [{
        value: '灯',
        name: '灯信息'
      }, {
        value: '人感',
        name: '人感信息'
      }, ],
      futureChecked: false, //全选
      futureFalseChecked: false, //反选
      showDetailChecked: false, //详情
      hotMapChecked: false, //热力图
      hotMapSevenChecked: false, //七天热力图
      ctrlBox: {
        btnShow: true,
        sideShow: false,
        isTrans: false, //防抖
      },
      ctrlBoxRG: {
        btnShow: true,
        sideShow: false,
        isTrans: false, //防抖
      },
      ctrlOverview: {
        btnShow: false,
        sideShow: true,
        isTrans: false, //防抖
      },
      lightImg1: lightImg1,
      lightImg2: lightImg2,
      lightImg0: lightImg0,
      factoryImg: factoryImg,
      factoryImg1: factoryImg1,
      map: '',
      mapOverview: '',
      // mapAnimate: false,
      hideSide: hideSide,
      lights: [],
      factory: [],
      activeLightsCalendar: [],
      time: null,
      lightCtrl: {
        sliderValue1: 0,
        sliderValue2: 0,
        sliderValue3: 0,
        numberValue: 0
      },
      lightCtrlClick: {
        openClick: false,
        closeClick: false,
        default100: false,
        default75: false,
        default50: false,
        default25: false,
      },
      lightSize: '60px',
      factorySize: '60px',
      // chooseSize: '23px',
      zoneId: -1,
      zoneName: '',
      ajaxTimeOut: true,
      ajaxTimeOutDel: true,
      centerDialogVisible: false,
      closeclickmodal: false,
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chartHot: null,
      intervalTime: [null, null, null],
      titleEnergy: '能源详情',
      hotmapData: [],
      hotmap: null,
      hotmapFlag: true,
      tableData: [],
      tableDataSeven: [],
      sendWsTime: null
    }
  },
  methods: {
    changeTab(index) {
      $(".lightsImg").attr('click', false);
      $(".chooseImg").hide();
      $(".heatmap-canvas,heatmap").remove();
      this.hotmap = null;
      this.groupingValue = '';
      this.futureChecked = false;
      this.futureFalseChecked = false;
      this.showDetailChecked = false;
      this.hotMapChecked = false;
      this.hotMapSevenChecked = false;
      this.hotmapData = [];
      this.activeLightsCalendar = [];
      this.tabIndex = index;
      this.tab.forEach((v, i) => {
        v.current = false;
        if (index == i) {
          v.current = true;
        }
      })
      this.ifFirstWs = {
        flag: true,
        Tk: 0
      };
      this.websocketonsend();
    },
    // 获取区域下的分组
    getgroupOptions() {
      if (this.zoneId != -1 && this.show.categoryList && this.tabIndex != 2 && this.tabIndex != 3) {
        findLightCategory(this.zoneId)
          .then(res => {
            if (res.resultCode == 'success') {
              this.groupOptions = res.data;
            }
          })
      }
    },
    // 能耗定时器
    cancle() {
      if (this.intervalTime[0] != null) {
        clearInterval(this.intervalTime[0]);
        clearInterval(this.intervalTime[1]);
        clearInterval(this.intervalTime[2]);
        clearInterval(this.intervalTime[3]);
        this.intervalTime = [null, null, null];
      }
    },
    //切换厂区
    changeFactory(src, index) {
      if (src.id == -1) {
        this.$message({
          type: 'info',
          message: '请在照明设置页面添加该厂区信息'
        });
      } else if (this.zoneId !== src.id) {
        this.futureChecked = false;
        this.futureFalseChecked = false;
        this.showDetailChecked = false;
        this.hotMapChecked = false;
        this.hotMapSevenChecked = false;
        $(".heatmap-canvas,heatmap").remove();
        this.hotmapData = [];
        this.hotmap = null;
        this.groupOptions = [];
        this.groupingValue = '';
        if (this.intervalTime[0] != null) {
          clearInterval(this.intervalTime[0]);
          clearInterval(this.intervalTime[1]);
          clearInterval(this.intervalTime[2]);
          clearInterval(this.intervalTime[3]);
          this.intervalTime = [null, null, null];
        }
        this.factory.forEach((v, i) => {
          this.$set(v, 'current', false);
        })
        this.$set(this.factory, index, { ...src,
          current: true
        });
        this.zoneId = src.id;
        this.zoneName = src.shortAddr;
        this.lights = [];
        this.activeLightsCalendar = [];
        this.lightSize = src.percentSize;
        this.map = map;
        let ImgObj = new Image(); //判断图片是否存在
        ImgObj.src = this.ipPix + src.picUrlPath;
        let _this = this;
        ImgObj.onload = function() {
          _this.map = _this.ipPix + src.picUrlPath;
        }
        this.ifFirstWs = {
          flag: true,
          Tk: 0
        };
        this.websocketonsend();
        this.getgroupOptions();
        this.$message({
          type: 'success',
          message: '进入控灯区域'
        });
      }
    },
    //取消选择
    cancalActive() {
      this.activeLightsCalendar = [];
      this.groupingValue = '';
      this.futureFalseChecked = '';
      this.initLightStates();
      $(".lightsImg").attr('click', false);
      $(".chooseImg").hide();
      this.averageLight();
    },
    // 选择灯
    showChildren(index, energy) {
      //判断e是不是工厂，是工厂可以进入下面的灯
      if (this.tabIndex == 2) {
        this.titleEnergy = `能源详情(id：${energy.shortAddr})`;
        this.centerDialogVisible = true;
        setTimeout(() => {
          this.initChart(index); //初始化实时能耗
          this.eneryAnaly(energy);
        })
      } else if (this.tabIndex == 3) {
        // console.log(index)
        // console.log(energy)
        this.tableData = [];
        this.tableDataSeven = [];
        currentThermalDiagram(this.zoneName)
          .then(res => {
            if (res.resultCode == 'success') {
              this.hotmapData = res.data;
              this.titleEnergy = `热力图(id：${energy.shortAddr})`;
              for (let i = 0; i < this.hotmapData.length; i++) {
                // console.log(this.hotmapData[i].shortAddr)
                if (energy.shortAddr == this.hotmapData[i].shortAddr) {
                  this.hotmapData[i].upCountTime = this.getTime(this.hotmapData[i].upCountTime);
                  // console.log(this.hotmapData[i])
                  this.tableData = [this.hotmapData[i]];
                  break;
                }
              }
              // console.log(this.tableData)
              // console.log(this.tableDataSeven)
              this.centerDialogVisible = true;
            }
          })
      } else {
        //选中灯
        // console.log(index)
        // console.log($(this.$refs[index]).attr('click'))
        this.$root.Bus.$emit("showLoading", true);
        this.futureChecked = false;
        this.futureFalseChecked = false;
        let el = this.tabIndex == 1 ? $(this.$refs[index]).children('img') : $(this.$refs[index]);
        let bool = el.attr('click') == 'false' ? true : false;

        this.initLightStates();
        // console.log(index)
        el.attr('click', bool);
        if (el.attr('click') == 'true') {
          this.activeLightsCalendar.push(this.lights[index]);
          el.next('img').show();
          this.$root.Bus.$emit("showLoading", false);
        } else {
          this.activeLightsCalendar.splice(this.activeLightsCalendar.findIndex(item => 'lightsImg' + item.shortAddr === $(this.$refs[index]).attr('id')), 1)
          if (this.activeLightsCalendar.length == 0) {
            this.initLightStates();
          }
          el.next('img').hide();
          this.$root.Bus.$emit("showLoading", false);
        }


        if (this.tabIndex == 0 && this.activeLightsCalendar.length > 0) {
          let sliderValue1 = 0,
            n = this.activeLightsCalendar.length;
          this.activeLightsCalendar.forEach((v, i) => {
            if (v.powerState === 0) {
              sliderValue1 += 0;
            } else {
              sliderValue1 += v.lightBright;
            }
          })
          sliderValue1 = Math.round(sliderValue1 / n);
          this.$set(this.lightCtrl, 'sliderValue1', sliderValue1);
          switch (sliderValue1) {
            case 100:
              this.$set(this.lightCtrlClick, 'default100', true);
              break;
            case 75:
              this.$set(this.lightCtrlClick, 'default50', true);
              break;
            case 50:
              this.$set(this.lightCtrlClick, 'default75', true);
              break;
            case 25:
              this.$set(this.lightCtrlClick, 'default25', true);
              break;
          }
        }
      }

    },
    // 侧边栏初始化
    initLightStates() {
      this.lightCtrl = {
        sliderValue1: 0,
        sliderValue2: 0,
        sliderValue3: 0,
        numberValue: 0
      };
      this.lightCtrlClick = {
        openClick: false,
        closeClick: false,
        default100: false,
        default75: false,
        default50: false,
        default25: false,
      }
    },
    // 侧边栏控制
    changeLightStates(state, value) {
      console.log(this.activeLightsCalendar)
      if (this.activeLightsCalendar.length != 0) {
        if (this.ajaxTimeOut) {
          this.ajaxTimeOut = false;
          this.lightCtrlClick = {
            openClick: false,
            closeClick: false,
            default100: false,
            default75: false,
            default50: false,
            default25: false,
          }
          // console.log(this.activeLightsCalendar)
          let addrs = '';
          this.activeLightsCalendar.forEach((v, i) => {
            addrs += v.shortAddr + '-'
          })
          let stateAjax = '';
          let brightness = -1;
          let indBright = -1;
          let unindBright = -1;
          let indTime = -1;
          addrs = addrs.substring(0, addrs.length - 1);
          // console.log(addrs)
          // console.log(this.activeLightsCalendar)
          this.$root.Bus.$emit("showLoading", true);
          if (state === '开关' || state === '亮度' || state === '预设亮度') {
            if (state === '开关') {
              if (value === 'ON') {
                this.lightCtrlClick.openClick = true;
              } else {
                this.lightCtrlClick.closeClick = true;
              }
              stateAjax = value;
            } else if (state === '亮度') {
              brightness = value;
            } else if (state === '预设亮度') {
              if (value === '100') {
                this.lightCtrlClick.default100 = true;
              } else if (value === '75') {
                this.lightCtrlClick.default75 = true;
              } else if (value === '50') {
                this.lightCtrlClick.default50 = true;
              } else if (value === '25') {
                this.lightCtrlClick.default25 = true;
              }
              brightness = value;
            }
            switchFn(
                stateAjax,
                addrs,
                brightness,
                indBright,
                unindBright,
                indTime,
              )
              .then(res => {
                this.ajaxTimeOut = true;
                this.$root.Bus.$emit("showLoading", false);
                if (res.resultCode == 'success') {
                  addrs = '';
                  this.$message({
                    type: 'success',
                    message: '设置成功'
                  });
                }
              })["catch"](() => {
                this.ajaxTimeOut = true;
                this.$root.Bus.$emit("showLoading", false);
              });
          } else if (state === '人感开关' || state === '激活亮度' || state === '未激活亮度' || state === '感应时间') {
            if (state === '人感开关') {
              if (value === 'ON') {
                this.lightCtrlClick.openClick = true;
              } else {
                this.lightCtrlClick.closeClick = true;
              }
              stateAjax = value;
            } else if (state === '激活亮度' || state === '未激活亮度') {
              if (this.lightCtrl.sliderValue2 < this.lightCtrl.sliderValue3) {
                // this.lightCtrl.sliderValue2 = 0;
                this.ajaxTimeOut = true;
                this.$root.Bus.$emit("showLoading", false);
                this.$message({
                  type: 'error',
                  message: '未激活亮度不能大于激活亮度'
                });
                return;
              }
              this.ajaxTimeOut = true;
              this.$root.Bus.$emit("showLoading", false);
              this.$message({
                type: 'info',
                message: '请点击开关进行控制',
                duration: 1000
              });
              return;
            } else if (state === '感应时间') {
              if (this.lightCtrl.numberValue < 0 || this.lightCtrl.numberValue == undefined || isNaN(this.lightCtrl.numberValue) || Number(this.lightCtrl.numberValue) == '') {
                // this.lightCtrl.numberValue = 0;
                this.ajaxTimeOut = true;
                this.$root.Bus.$emit("showLoading", false);
                this.$message({
                  type: 'error',
                  message: '请设置正确的感应时间'
                });
                return;
              }
              // indTime = Number(value);
              this.ajaxTimeOut = true;
              this.$root.Bus.$emit("showLoading", false);
              this.$message({
                type: 'info',
                message: '请点击开关进行控制',
                duration: 1000
              });
              return;
            }
            if (this.lightCtrl.sliderValue2 < this.lightCtrl.sliderValue3) {
              this.$message({
                type: 'error',
                message: '未激活亮度不能大于激活亮度',
                duration: 1000
              });
              this.$root.Bus.$emit("showLoading", false);
              this.ajaxTimeOut = true;
              return;
            }
            if (stateAjax === 'OFF' || (stateAjax === 'ON' && Number(this.lightCtrl.numberValue) != 0 && this.lightCtrl.sliderValue2 != 0 && this.lightCtrl.sliderValue3 != 0 && (this.lightCtrl.sliderValue2 > this.lightCtrl.sliderValue3) && !isNaN(this.lightCtrl.numberValue))) {
              peoplefeel(
                  stateAjax,
                  addrs,
                  this.lightCtrl.sliderValue2,
                  this.lightCtrl.sliderValue3,
                  Number(this.lightCtrl.numberValue),
                )
                .then(res => {
                  this.ajaxTimeOut = true;
                  this.$root.Bus.$emit("showLoading", false);
                  if (res.resultCode == 'success') {
                    addrs = '';
                    this.$message({
                      type: 'success',
                      message: '设置成功'
                    });
                  }
                })["catch"]((err) => {
                  this.ajaxTimeOut = true;
                  this.$root.Bus.$emit("showLoading", false);
                  this.$message({
                    type: 'error',
                    message: err.response.data.message
                  });
                });
            } else {
              this.$root.Bus.$emit("showLoading", false);
              this.ajaxTimeOut = true;
              this.$message({
                type: 'info',
                message: '请先设置正确的激活亮度、未激活亮度（未激活亮度不能大于激活亮度）、感应时间(不能为0)'
              });
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: '您的操作过于频繁，请稍后重试'
          });
        }
      } else {
        this.$message({
          type: 'error',
          message: '请选择要控制的灯'
        });
      }
    },
    showDetailCheckedChange() {},
    initHotmap() {
      // $(".heatmap-canvas,heatmap").remove();
      // this.hotmapData = [];
      // this.hotmap = null;
      // this.hotmap = Heatmap.create({
      //   container: document.querySelector('#normalMap'),
      //   // radius: 10,
      //   // maxOpacity: .5,
      //   // minOpacity: 0,
      // });
    },
    hotMapCheckedChange() {
      if (this.hotMapSevenChecked) {
        this.hotMapChecked = null;
        this.$message({
          type: 'info',
          message: '请先切换至地图页面'
        });
        // console.log(this.hotMapChecked)
        // console.log(this.hotMapSevenChecked)
        return;
      }
      if (this.hotMapChecked == null) {
        this.hotMapChecked = true
      }
      if (this.hotMapChecked && this.tabIndex === 3) {
        if (this.hotmap == null) {
          this.initHotmap();
        }
        currentThermalDiagram(this.zoneName)
          .then(res => {
            if (res.resultCode == 'success') {
              this.hotmapData = res.data;
              this.hotmapResize();
            }
          })
        if (this.hotmapFlag) {
          setTimeout(() => {
            this.hotMapCheckedChange();
          }, 10000)
        }
      } else {
        // console.log($("canvas,heatmap"))
        $(".heatmap-canvas,heatmap").remove();
        this.hotmap = null;
        this.hotmapData = [];
      }
    },
    hotmapResize() {
      // console.log(this.hotmap)
      if (this.hotMapChecked && this.hotmap != null && this.tabIndex === 3) {
        // console.log($('#normalMap'))
        let data = [];
        let w = $('#normalMap').width();
        let h = $('#normalMap').height();
        let chooseImgW = $('.lightsImg').width() / 2;
        let chooseImgH = $('.lightsImg').height() / 2;
        let max = 0,
          min = '';
        // console.log(w)
        // console.log($('.lightsImg'))

        this.hotmapData.forEach((v, i) => {
          min = min == '' ? v.msgCount - 10 < 0 ? 0 : v.msgCount - 10 < 0 : min;
          if (v.msgCount > max) {
            max = v.msgCount;
          }
          if (v.msgCount < min) {
            min = v.msgCount;
          }
          if (v.msgCount > 0) {
            data.push({
              x: v.xAxis == null ? null : (v.xAxis * w + chooseImgW).toFixed(0),
              y: v.yAxis == null ? null : (v.yAxis * h + chooseImgH).toFixed(0),
              value: v.msgCount
            })
          }
        })
        // console.log(data)
        // console.log(max)
        // console.log(min)
        this.hotmap.setData({
          max: max,
          min: min,
          data: data
        });
        data = null;
      }
    },
    getTime(time) {
      if (time == null || time < 0) {
        return time;
      }
      let hours = Math.floor(time / (60 * 60));
      let minutes = Math.floor((time - hours * (60 * 60)) / (60));
      let second = Math.floor((time - hours * (60 * 60) - minutes * (60)));
      let diffTime;
      if (minutes < 10) {
        diffTime = '0' + hours;
      } else {
        diffTime = hours;
      }
      if (minutes < 10) {
        diffTime = diffTime + ":0" + minutes;
      } else {
        diffTime = diffTime + ":" + minutes;
      }
      if (second < 10) {
        diffTime = diffTime + ":0" + second;
      } else {
        diffTime = diffTime + ":" + second;
      }
      return diffTime;
    },
    hotMapSevenCheckedChange() {
      // console.log(this.hotMapSevenChecked)
      if (this.hotMapChecked) {
        this.hotMapSevenChecked = null;
        this.$message({
          type: 'info',
          message: '请先切换至地图页面'
        });
        return;
      }
      if (this.hotMapSevenChecked == null) {
        this.hotMapSevenChecked = true
      }
      let option = null;
      if (this.hotMapSevenChecked) {
        this.$root.Bus.$emit("showLoading", true);
        weekThermalDiagram(this.zoneName)
          .then(res => {
            this.$root.Bus.$emit("showLoading", false);
            if (res.resultCode == 'success') {
              let max = '',
                min = '',
                xAxis = [],
                yAxis = [],
                data = [],
                newObjArr = [];
              for (let key in res.data) {
                xAxis.push(key);
                if (res.data[key] != null) {
                  for (let i = 0; i < res.data[key].length; i++) {
                    max = max == '' ? res.data[key][i].upCountTime : max;
                    min = min == '' ? res.data[key][i].upCountTime - 10 : min;
                    if (res.data[key][i].upCountTime > max) {
                      max = res.data[key][i].upCountTime;
                    }
                    if (res.data[key][i].upCountTime < min) {
                      min = res.data[key][i].upCountTime;
                    }
                    if (yAxis.indexOf(res.data[key][i].shortAddr) === -1) {
                      yAxis.push(res.data[key][i].shortAddr);
                    }
                  }
                }
                newObjArr.push(res.data[key]);
              }
              newObjArr.forEach((vX, iX) => {
                if (vX != null) {
                  vX.forEach((vY, iY) => {
                    data.push([iX, yAxis.indexOf(vY.shortAddr), vY.upCountTime])
                  })
                }
              })
              this.chartHot = echarts.init(
                document.getElementById("hotMapSevenMap")
              ); //定义
              option = {
                animation: false,
                grid: {
                  height: '80%',
                  y: '10%'
                },
                label: {
                  color: '#000'
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    left: '93%',
                    start: 0,
                    end: 100
                  },
                  {
                    type: 'inside',
                    yAxisIndex: [0],
                    start: 0,
                    end: 100
                  }
                ],
                tooltip: {
                  position: 'top',
                  formatter: function(params) {
                    // var t = this.y;
                    // console.log(params)
                    return (
                      "累计运行时间:" + params.data[2] + '(s)'
                    );
                  }
                },
                yAxis: {
                  type: 'category',
                  data: yAxis,
                  splitArea: {
                    show: true
                  },
                  nameGap: 20,
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: "#707070"
                    }
                  },
                  axisLabel: {
                    color: '#707070'
                  },
                  splitLine: {
                    lineStyle: {
                      color: '#eee'
                    }
                  },
                  axisTick: {
                    show: false
                  },
                  name: 'id'
                },
                xAxis: {
                  type: 'category',
                  data: xAxis,
                  splitArea: {
                    show: true
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#d8d8d8"
                    }
                  },
                  nameTextStyle: {
                    color: '#707070'
                  },
                  axisLabel: {
                    color: '#707070'
                  },
                  axisTick: {
                    show: false,
                    alignWithLabel: false
                  },
                  name: '日期'
                },
                visualMap: {
                  min: min,
                  max: max,
                  calculable: true,
                  orient: 'horizontal',
                  left: 'center',
                  bottom: '0%'
                },
                series: [{
                  type: 'heatmap',
                  data: data,
                  label: {
                    normal: {
                      show: false
                    }
                  },
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }]
              };
              //等待的显示
              this.chartHot.setOption(option); //展示
              this.chartHot.resize();
              let _this = this;
              window.addEventListener('resize', function() {
                if (_this.chartHot != null) {
                  setTimeout(() => {
                    _this.chartHot.resize();
                  }, 0)
                }
              })

              function eClick(param) {
                _this.tableDataSeven = [];
                _this.tableData = [];
                ThermalDiagramofDay(param.name, yAxis[param.data[1]])
                  .then(res => {
                    if (res.resultCode == 'success') {
                      let data = Object.values(JSON.parse(res.data));
                      data.forEach((v, i) => {
                        v.UpCountTime = _this.getTime(v.UpCountTime);
                      })
                      _this.tableDataSeven = [...data];
                      _this.titleEnergy = `七天热力图(id：${yAxis[param.data[1]]})`;
                      _this.centerDialogVisible = true;
                      data = null;
                    }
                  })
              }
              this.chartHot.on('click', eClick)
            }
          }).catch(() => {
            this.$root.Bus.$emit("showLoading", false);
          });
      } else {
        option = null;
        this.chartHot = null;
      }
    },
    averageLight() {
      if (this.tabIndex === 0) {
        let sliderValue1 = 0,
          n = this.activeLightsCalendar.length;
        this.activeLightsCalendar.forEach((v, i) => {
          if (v.powerState === 0) {
            sliderValue1 += 0;
          } else {
            sliderValue1 += v.lightBright;
          }
        })
        sliderValue1 = Math.round(sliderValue1 / n) || 0;
        this.$set(this.lightCtrl, 'sliderValue1', sliderValue1);
      }
    },
    // 全选
    futureCheckedChange() {
      this.activeLightsCalendar = [];
      this.groupingValue = '';
      this.futureFalseChecked = '';
      if (this.futureChecked) {
        this.lights.forEach((v, i) => {
          this.activeLightsCalendar.push(v);
        })
        $(".lightsImg").attr('click', true);
        $(".chooseImg").show();
      } else {
        this.initLightStates();
        $(".lightsImg").attr('click', false);
        $(".chooseImg").hide();
      }
      this.averageLight();
    },
    // 反选
    futureFalseCheckedChange() {
      this.activeLightsCalendar = [];
      this.groupingValue = '';
      this.futureChecked = '';
      for (let i = 0; i < $('.lightsImg').length; i++) {
        if ($($('img.lightsImg')[i]).attr('click') === 'false') {
          this.activeLightsCalendar.push(this.lights[$($('.lightsImg')[i]).attr('index')]);
        }
        $($('.lightsImg')[i]).attr('click', $($('.lightsImg')[i]).attr('click') === 'false' ? true : false);
        $($('.lightsImg')[i]).next('img').toggle();
      }
      this.averageLight();
      if (this.activeLightsCalendar.length == 0) {
        this.initLightStates();
      }
    },
    // 动画
    btnMoveAfterLeave() {
      this.ctrlBox.sideShow = !this.ctrlBox.sideShow;
      this.ctrlBox.isTrans = false;
    },
    sideMoveAfterLeave() {
      this.ctrlBox.btnShow = !this.ctrlBox.btnShow;
      this.ctrlBox.isTrans = false;
      this.initLightStates();
    },
    btnTrans() {
      if (this.ctrlBox.isTrans) {
        return;
      }
      this.ctrlBox.isTrans = true;
      this.ctrlBox.btnShow = !this.ctrlBox.btnShow;
    },
    sideTrans() {
      if (this.ctrlBox.isTrans) {
        return;
      }
      this.ctrlBox.isTrans = true;
      this.ctrlBox.sideShow = !this.ctrlBox.sideShow;
    },
    btnMoveAfterLeaveRG() {
      this.ctrlBoxRG.sideShow = !this.ctrlBoxRG.sideShow;
      this.ctrlBoxRG.isTrans = false;
    },
    sideMoveAfterLeaveRG() {
      this.ctrlBoxRG.btnShow = !this.ctrlBoxRG.btnShow;
      this.ctrlBoxRG.isTrans = false;
      this.initLightStates();
    },
    btnTransRG() {
      if (this.ctrlBoxRG.isTrans) {
        return;
      }
      this.ctrlBoxRG.isTrans = true;
      this.ctrlBoxRG.btnShow = !this.ctrlBoxRG.btnShow;
    },
    sideTransRG() {
      if (this.ctrlBoxRG.isTrans) {
        return;
      }
      this.ctrlBoxRG.isTrans = true;
      this.ctrlBoxRG.sideShow = !this.ctrlBoxRG.sideShow;
    },
    btnMoveAfterLeaveOverview() {
      this.ctrlOverview.sideShow = !this.ctrlOverview.sideShow;
      this.ctrlOverview.isTrans = false;
    },
    sideMoveAfterLeaveOverview() {
      this.ctrlOverview.btnShow = !this.ctrlOverview.btnShow;
      this.ctrlOverview.isTrans = false;
    },
    sideTransOverview() {
      if (this.ctrlOverview.isTrans) {
        return;
      }
      this.ctrlOverview.isTrans = true;
      this.ctrlOverview.sideShow = !this.ctrlOverview.sideShow;
    },
    btnTransOverview() {
      if (this.ctrlOverview.isTrans) {
        return;
      }
      this.ctrlOverview.isTrans = true;
      this.ctrlOverview.btnShow = !this.ctrlOverview.btnShow;
    },
    // 删除分组
    delgroup() {
      if (this.ajaxTimeOutDel) {
        this.$confirm('此操作将删除该分组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = 0;
          this.groupOptions.forEach((v, i) => {
            if (v.id == this.groupingValue.split('+')[0]) {
              id = v.id;
            }
          })
          this.ajaxTimeOutDel = false;
          removeLightCategory(id)
            .then(res => {
              this.ajaxTimeOutDel = true;
              if (res.resultCode == 'success') {
                this.getgroupOptions();
                this.groupingValue = '';
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
              }
            })["catch"](() => {
              this.ajaxTimeOutDel = true;
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
    // 新建分组
    creatGroup() {
      if (this.activeLightsCalendar.length != 0) {
        this.$prompt('', '创建分组', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入分组名称',
        }).then(({
          value
        }) => {
          this.groupingValue = '';
          let devices = '';
          this.activeLightsCalendar.forEach((v, i) => {
            devices += v.shortAddr + '-'
          })
          if (value.indexOf('null') != -1 || value.indexOf('undefined') != -1) {
            this.$message({
              type: 'info',
              message: '请输入正确的分组名'
            });
            return;
          }
          let formData = new FormData();
          formData.append('name', value)
          formData.append('devices', devices.substring(0, devices.length - 1))
          formData.append('zoneId', this.zoneId)
          formData.append('deviceType', 1)
          // {
          //     "name": value,
          //     "devices": devices.substring(0, devices.length - 1),
          //     "zoneId": this.zoneId,
          //     "deviceType": 1,
          //     "gmtCreate": "",
          //     "gmtModified": ""
          //   }
          saveLightCategory(formData)
            .then(res => {
              if (res.resultCode == 'success') {
                devices = '';
                this.getgroupOptions();
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
              }
            })
          // 给分组列表里添加
          // this.groupingValue=[]
          // this.getgroupOptions();
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择要分组的灯'
        });
      }
    },
    // 改变分组
    groupChange(light) {
      console.log(light)
      this.futureChecked = false;
      this.futureFalseChecked = false;
      this.activeLightsCalendar = [];
      // console.log(l)
      if (light === '') {
        $(".lightsImg").attr('click', false);
        $(".chooseImg").hide();
      } else {
        let l = light.split('+')[1].split('-');
        // console.log('----------------------------')
        if (this.tabIndex == 0) {
          this.lights.forEach((v, i) => {
            $("#lightsImg" + v.shortAddr).attr('click', false);
            $("#lightsImg" + v.shortAddr).next().hide();
            l.filter((vLight, iLight) => {
              // debugger
              if (v.shortAddr == vLight) {
                $("#lightsImg" + v.shortAddr).attr('click', true);
                $("#lightsImg" + v.shortAddr).next().show();
                this.activeLightsCalendar.push(v);
                l.splice(l.findIndex(item => item === vLight), 1)
              }
            })
          })
        } else {
          this.lights.forEach((v, i) => {
            $("#lightsImg" + v.shortAddr + ' img.lightsImg').attr('click', false);
            $("#lightsImg" + v.shortAddr + ' img.chooseImg').hide();
            l.filter((vLight, iLight) => {
              // debugger
              if (v.shortAddr == vLight) {
                $("#lightsImg" + v.shortAddr + ' img.lightsImg').attr('click', true);
                $("#lightsImg" + v.shortAddr + ' img.chooseImg').show();
                this.activeLightsCalendar.push(v);
                l.splice(l.findIndex(item => item === vLight), 1)
              }
            })
          })
        }
      }
    },
    // 获取工厂信息
    getLights() {
      findLightConfAreaTemp()
        .then(res => {
          if (res.resultCode == 'success') {
            if (res.data.lightAreaInfo != undefined) {
              this.factory = JSON.parse(res.data.lightAreaInfo);
              this.factory.forEach((v, i) => {
                this.$set(v, 'current', false);
              })
              this.factorySize = res.data.percentSize;
              this.mapOverview = map;
              this.map = map;
              let ImgObj = new Image(); //判断图片是否存在
              let _this = this;
              ImgObj.src = this.ipPix + res.data.picUrlPath;
              ImgObj.onload = function() {
                _this.mapOverview = _this.ipPix + res.data.picUrlPath;
              }
              let ImgObj1 = new Image(); //判断图片是否存在
              ImgObj1.src = this.ipPix + res.data.picUrlPath;
              ImgObj1.onload = function() {
                _this.map = _this.ipPix + _this.factory[0].picUrlPath;
              }
              this.zoneId = this.factory[0].id;
              this.$set(this.factory, 0, { ...this.factory[0],
                current: true
              });
              this.lightSize = this.factory[0].percentSize;
              this.initWebpack();
              console.log(this.factory)
              ImgObj = null;
              ImgObj1 = null;
            } else {
              this.$message({
                type: 'info',
                message: '请在照明设置页面进行配灯'
              });
            }
          }
        })["catch"](() => {
          this.map = map;
        });
    },
    initWebpack() {
      // console.log(this.websockUrl);
      //初始化websocket
      this.websock = `ws://${this.ipWs}/api/v1/lightcontrol`;
      this.websock = new WebSocket(this.websock); //这里面的this都指向vue
      this.websock.onopen = this.websocketopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
      this.websock.onerror = this.websocketerror;
    },
    websocketopen() {
      //打开
      console.log("WebSocket连接成功");
      this.websocketonsend();
      this.getgroupOptions();
      this.sendWsTime = setInterval(() => {
        this.websock.send('');
      }, 40000)
    },
    websocketonmessage(e) {
      //数据接收
      // console.log(e)
      //MD:判断是全量还是增量   TK:时间戳  TP:tab栏  QY:区域
      if (e.data !== '') {
        let data = JSON.parse(e.data);
        if (data.MD === 0) { //接收全量
          if (data.TP === this.tabIndex && data.QY === this.zoneId) {
            this.ifFirstWs = {
              TK: data.TK,
              flag: false
            };
            this.websocketonsend();
          } else {
            this.ifFirstWs = {
              TK: 0,
              flag: true
            };
            this.websocketonsend();
          }
          this.lights = data.DATA;
        } else if (data.MD === 1) { //接收增量 新增
          let arr = [...data.DATA, ...this.lights];
          // console.log(data.DATA)
          // console.log(arr)
          this.lights = [...arr];
          arr = null;
        } else if (data.MD === 2) { //接收增量 删除
          data.DATA.forEach((v, i) => {
            this.lights.splice(this.lights.findIndex(item => item.shortAddr === v), 1);
          })
        } else if (data.MD === 3 || data.MD === 4) { //接收增量 修改
          // console.time()
          let arr = [...this.lights];
          data.DATA.forEach((v, i) => {
            let n = arr.findIndex(item => item.shortAddr === v.shortAddr)
            arr[n] = { ...arr[n],
              ...v
            };

          })
          this.lights = [...arr];
          arr = null;
          if (this.tabIndex == 0 && this.activeLightsCalendar.length > 0 && data.MD === 3) {
            this.activeLightsCalendar.forEach((v, i) => {
              let n = data.DATA.find(item => item.shortAddr === v.shortAddr)
              this.$set(this.activeLightsCalendar, i, { ...v,
                ...n
              })
            })
            this.averageLight();
            this.lightCtrlClick.default100 = false;
            this.lightCtrlClick.default50 = false;
            this.lightCtrlClick.default75 = false;
            this.lightCtrlClick.default100 = false;
            switch (sliderValue1) {
              case 100:
                this.$set(this.lightCtrlClick, 'default100', true);
                break;
              case 75:
                this.$set(this.lightCtrlClick, 'default50', true);
                break;
              case 50:
                this.$set(this.lightCtrlClick, 'default75', true);
                break;
              case 25:
                this.$set(this.lightCtrlClick, 'default25', true);
                break;
            }
          }
          // console.timeEnd()
        }
      }
      // console.log(this.lights)
    },
    websocketonsend(e) {
      if (this.websock) {
        // console.log(this.zoneId)
        // console.log(this.ifFirstWs)
        let msg = {
          'TP': this.tabIndex,
          'QY': this.zoneId,
          'CF': this.ifFirstWs.flag ? 0 : 1,
          'deviceType': 1
        }
        if (!this.ifFirstWs.flag) {
          msg.TK = this.ifFirstWs.TK;
        }
        this.websock.send(JSON.stringify(msg));
        msg = null;
      }
    },
    websocketclose(source) {
      //关闭
      if (this.websock) {
        console.log("WebSocket关闭")
        this.ifFirstWs = {
          flag: true,
          Tk: 0
        }
        this.websock.close();
        this.websock = null;
        clearInterval(this.sendWsTime);
        this.sendWsTime = null;
      }
      let _this = this;
      console.log(location.hash == "#/LightBox/LightCtrl")
      if (location.hash == "#/LightBox/LightCtrl" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
        setTimeout(() => {
          _this.initWebpack();
          _this = null;
        }, 15000)
      }
    },
    websocketerror() {
      //失败
      console.log("WebSocket连接失败");
      // let _this = this;
      // if (location.hash == "#/LightBox/LightCtrl" && (!!window.ActiveXObject || "ActiveXObject" in window)) {
      //   setTimeout(() => {
      //     _this.websocketclose();
      //     _this.initWebpack();
      //     _this = null;
      //   }, 15000)
      // }
    },
    //实时能耗  初始化图表
    initChart(index) {
      let _this = this;
      let y = 0;

      function activeLastPointToolip(chart) {
        var points = chart.series[0].points;
        chart.tooltip.refresh(points[points.length - 1]);
      }
      this.chart1 = Highcharts.chart("chart1", {
        colors: ["#68b8f5"],
        credits: {
          enabled: false
        },
        time: {
          useUTC: false
        },
        chart: {
          type: "spline",
          marginLeft: 54,
          // margin: [40, 40, 40, 54],
          events: {
            load: function() {
              var series = this.series[0],
                chart1 = this;
              activeLastPointToolip(chart1);
              _this.intervalTime[0] = setInterval(function() {
                if (_this.lights[index] == undefined) {
                  y = 0;
                } else {
                  y = _this.lights[index].electricity == undefined ? 0 : _this.lights[index].electricity; // 随机值
                }
                series.addPoint([new Date().getTime(), y], true, true);
                activeLastPointToolip(chart1);
              }, 1000);
            }
          }
        },
        title: {
          text: "电流实时数据", //主标题文本，'\n'指定换行
          y: 2,
          x: 20,
          style: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontSize: "14px", //字体大小
            color: "#303030",
            fontStyle: "normal",
            fontWeight: "normal"
          }
        },
        xAxis: {
          lineColor: '#d8d8d8',
          type: "datetime",
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            rotation: "360",
            text: "(A)",
            x: 20,
            y: -80,
            style: {}
          },
          labels: {
            formatter: function() {
              return Math.round(this.value * 1000) / 1000;
            }
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: "#eeeeee"
          }]
        },
        tooltip: {
          backgroundColor: "#3c70d7",
          borderColor: "#3c70d7",
          style: {
            color: "#fff"
          },
          shadow: false,
          borderRadius: 8,
          valueDecimals: 2,
          formatter: function() {
            var t = this.y;
            return (
              "<b style='font-size: 14px;margin-bottom: 12px;display: inline-block;'>" +
              this.series.name +
              "</b><br/><span style='font-size: 14px;margin-bottom: 12px;display: inline-block;'>" +
              _this.$moment(this.x).format("YYYY-MM-DD HH:mm:ss") +
              "</span><br/><span style='font-size: 14px;'>" +
              Math.round(t * 1000) / 1000 +
              "</span>"
            );
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: "电流",
          data: (function() {
            // 生成随机值
            var data = [],
              time = new Date().getTime(),
              i;
            for (i = -10; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: 0
              });
            }
            return data;
          })()
        }]
      });
      this.chart2 = Highcharts.chart("chart2", {
        colors: ["#59c4c5"],
        credits: {
          enabled: false
        },
        time: {
          useUTC: false
        },
        chart: {
          type: "spline",
          marginLeft: 54,
          // margin: [40, 40, 40, 40],
          events: {
            load: function() {
              var series = this.series[0],
                chart2 = this;
              activeLastPointToolip(chart2);
              _this.intervalTime[1] = setInterval(function() {
                if (_this.lights[index] == undefined) {
                  y = 0;
                } else {
                  y = _this.lights[index].voltage == undefined ? 0 : _this.lights[index].voltage; // 随机值
                }
                series.addPoint([new Date().getTime(), y], true, true);
                activeLastPointToolip(chart2);
              }, 1000);
            }
          }
        },
        title: {
          text: "电压实时数据", //主标题文本，'\n'指定换行
          y: 2,
          x: 20,
          style: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontSize: "14px", //字体大小
            color: "#303030",
            fontStyle: "normal",
            fontWeight: "normal"
          }
        },
        xAxis: {
          lineColor: '#d8d8d8',
          type: "datetime",
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            rotation: "360",
            text: "(V)",
            x: 20,
            y: -80,
            style: {}
          },
          labels: {
            formatter: function() {
              return Math.round(this.value * 1000) / 1000;
            }
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: "#eeeeee"
          }]
        },
        tooltip: {
          backgroundColor: "#59c4c5",
          borderColor: "#59c4c5",
          shadow: false,
          style: {
            color: "#fff"
          },
          valueDecimals: 2,
          borderRadius: 8,
          formatter: function() {
            var t = this.y;
            return (
              "<b style='font-size: 14px;margin-bottom: 12px;display: inline-block;'>" +
              this.series.name +
              "</b><br/><span style='font-size: 14px;margin-bottom: 12px;display: inline-block;'>" +
              _this.$moment(this.x).format("YYYY-MM-DD HH:mm:ss") +
              "</span><br/><span style='font-size: 14px;'>" +
              Math.round(t * 1000) / 1000 +
              "</span>"
            );
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: "电压",
          data: (function() {
            // 生成随机值
            var data = [],
              time = new Date().getTime(),
              i;
            for (i = -10; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: 0
              });
            }
            return data;
          })()
        }]
      });
      this.chart3 = Highcharts.chart("chart3", {
        colors: ["#72a5e9"],
        chart: {
          type: "spline",
          // margin: [40, 50, 40, 40],
          marginLeft: 54,
          events: {
            load: function() {
              // set up the updating of the chart each second
              var series = this.series[0],
                chart3 = this;
              activeLastPointToolip(chart3);
              _this.intervalTime[2] = setInterval(function() {
                if (_this.lights[index] == undefined) {
                  y = 0;
                } else {
                  y = _this.lights[index].power == undefined ? 0 : _this.lights[index].power; // 随机值
                }
                series.addPoint([new Date().getTime(), y], true, true);
                activeLastPointToolip(chart3);
              }, 1000);
            }
          }
        },

        time: {
          useUTC: false
        },
        title: {
          text: "功率实时数据", //主标题文本，'\n'指定换行
          y: 2,
          x: 20,
          style: {
            //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontSize: "14px", //字体大小
            color: "#303030",
            fontStyle: "normal",
            fontWeight: "normal"
          }
        },
        xAxis: {
          lineColor: '#d8d8d8',
          type: "datetime",
          tickPixelInterval: 150
        },
        credits: {
          enabled: false
        },
        yAxis: {
          title: {
            rotation: "360",
            text: "(W)",
            x: 20,
            y: -80,
            style: {}
          },
          labels: {
            formatter: function() {
              return Math.round(this.value * 1000) / 1000;
            }
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: "#eeeeee"
          }]
        },
        tooltip: {
          hideDelay: 500000,
          backgroundColor: "#72a5e9",
          borderRadius: 8,
          shadow: false,
          valueDecimals: 2,
          style: {
            color: "#fff"
          },
          formatter: function() {
            var t = this.y;
            return (
              "<b style='font-size: 14px;margin-bottom: 24px;display: inline-block;'>" +
              this.series.name +
              "</b><br/><span style='font-size: 14px;margin-bottom: 12px;display: inline-block;'>" +
              _this.$moment(this.x).format("YYYY-MM-DD HH:mm:ss") +
              "</span><br/><span style='font-size: 14px;'>" +
              Math.round(t * 1000) / 1000 +
              "</span>"
            );
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: "功率",
          data: (function() {
            // generate an array of random data
            var data = [],
              time = new Date().getTime(),
              i;

            for (i = -10; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: 0
              });
            }
            return data;
          })()
        }]
      });
      // window.addEventListener("resize", this.resize);
    },
    //能耗分析 初始化图表
    eneryAnaly(energy) {
      if (this.show.analyse) {
        var ElecArr = [];
        var VoltArr = [];
        var hourArr = [];
        let eneryoption = {
          legend: {
            left: "right",
            padding: [0, 40, 0, 0],
            top: "8%",
            // right: "40px",
            data: [{
                name: "电流(A)",
                icon: 'pin',
                textStyle: {
                  color: "#68c161", // 图例文字颜色
                  fontFamily: 'Microsoft YaHei',
                }
              },
              {
                name: "电压(V)",
                icon: 'pin',
                textStyle: {
                  fontFamily: 'Microsoft YaHei',
                  color: "#289bf4" // 图例文字颜色
                }
              }
            ]
          },
          grid: {
            left: '40px',
            right: '40px',
            bottom: '40px',
            top: '50px'
          },
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
          xAxis: {
            axisLabel: {
              color: '#505050'
            },
            data: hourArr,
            type: 'category',
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: "#d8d8d8"
              }
            },
            nameTextStyle: {
              fontFamily: 'Microsoft YaHei',
              color: '#707070'
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            name: "时",
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#505050',
              margin: 40,
              align: 'left'
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#eee'
              }
            },
            type: 'value',
            nameGap: 20,
            splitLine: {
              lineStyle: {
                color: '#eee'
              }
            },
          },
          series: [{
              symbol: "none",
              itemStyle: {
                normal: {
                  color: "#5fbc68",
                  lineStyle: {
                    color: "#5fbc68"
                  }
                }
              },
              name: "电流(A)",
              type: "line",
              data: ElecArr
            },
            {
              symbol: "none",
              itemStyle: {
                normal: {
                  color: "#4f9eda",
                  lineStyle: {
                    color: "#4f9eda"
                  }
                }
              },
              name: "电压(V)",
              type: "line",
              data: VoltArr
            }
          ]
        };
        if (energy.shortAddr != undefined) {
          analyse(energy.shortAddr)
            .then(res => {
              // console.log(res);
              if (res.resultCode == "success" && document.getElementById("chart4")) {
                if (res.data.length > 0) {
                  for (var i = 0; i < res.data.length; i++) {
                    ElecArr.push(res.data[i].averElec);
                    VoltArr.push(res.data[i].averV);
                    hourArr.push(res.data[i].hour);
                  }
                  this.chart4 = echarts.init(
                    document.getElementById("chart4")
                  ); //定义
                  this.chart4.clear();
                  // this.chart4.showLoading();  //等待的显示
                  this.chart4.setOption(eneryoption); //展示
                  // window.addEventListener("resize", this.resize);
                } else {
                  for (var i = 0; i < 24; i++) {
                    hourArr.push(i);
                  }
                  this.chart4 = echarts.init(
                    document.getElementById("chart4")
                  ); //定义
                  this.chart4.clear();
                  // this.chart4.showLoading();  //等待的显示
                  this.chart4.setOption(eneryoption); //展示
                  // window.addEventListener("resize", this.resize);
                }
              }
            })
        } else {
          for (var i = 0; i < 24; i++) {
            hourArr.push(i);
          }
          this.chart4 = echarts.init(
            document.getElementById("chart4")
          ); //定义
          this.chart4.clear();
          // this.chart4.showLoading();  //等待的显示
          this.chart4.setOption(eneryoption); //展示
          // window.addEventListener("resize", this.resize);
        }
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
  },
  mounted() {
    this.getLights();
    // console.log('----------------------------')
    $(".heatmap-canvas,heatmap").remove();
    this.hotmap = null;
    window.addEventListener('resize', this.hotmapResize);
    this.$root.Bus.$emit("hideAsideFlag", true);
  },
  destroyed() {
    // this.websocketclose('web');
    this.ifFirstWs = {
      flag: true,
      Tk: 0
    }
    this.websock.close();
    this.websock = null;
    clearInterval(this.sendWsTime);
    this.sendWsTime = null;
    if (this.intervalTime[0] != null) {
      clearInterval(this.intervalTime[0]);
      clearInterval(this.intervalTime[1]);
      clearInterval(this.intervalTime[2]);
      clearInterval(this.intervalTime[3]);
      this.intervalTime = [null, null, null];
    }
    $(".heatmap-canvas,heatmap").remove();
    this.hotmap = null;
    this.hotmapFlag = false;
    this.chartHot = null;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang='scss'>
@import "./assets/styles/common";
.el-popover {
  min-width: 0;
}

.LightCtrl {
  .el-dialog--center .el-dialog__body {
    padding: 26px 40px;
  }
  .el-slider {
    width: 162px;
    display: inline-block;
    margin-top: 12px;
    margin-right: 20px;
  }
  .el-slider__runway {
    height: 2px;
    background-color: #a8a8a8;
  }
  .el-slider__button {
    width: 14px;
    height: 14px;
    border: none;
    background-color: #64b2ff;
  }
  .el-slider__bar {
    background-color: #64b2ff;
    border-radius: 0;
    height: 2px;
  }
  .el-slider__button-wrapper {
    top: -17px;
  }
  .el-table {
    padding-top: 0 !important;
    .cell>div:last-child {
      hr {
        display: none;
      }
    }
  }
  .dialog-header {
    display: inline-block;
    height: 100%;
    line-height: 49px;
    font-size: 16px;
  }
  width: 100%;
  height: 100%; // overflow: hidden;
  .tabDiv {
    height: 40px;
    line-height: 40px;
    margin: -30px -50px 30px;
    @include media($m1366) {
      margin: -12px -50px 15px; // height: 30px;
      // line-height: 30px;
    }
    background-color: #e3e7ee;
    text-align: left;
    padding: 0 50px;
    overflow: hidden;
    span {
      display: inline-block;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      width: 90px;
      height: 30px;
      line-height: 30px;
      background-color: #d2d7e1;
      color: #607380;
      border-radius: 4px;
      margin-top: 8px;
      margin-right: 4px;
    }
    span.current {
      height: 32px;
      border-radius: 4px 4px 0 0;
      line-height: 30px;
      color: #fbad33;
      background-color: #eef1f7;
    }
  } // .speedUp {
  //   -webkit-transform: translate3d(0, 0, 0);
  //   -moz-transform: translate3d(0, 0, 0);
  //   -ms-transform: translate3d(0, 0, 0);
  //   transform: translate3d(0, 0, 0);
  //   transition: transform 1s;
  // }
  .ctrl {
    text-align: left;
    height: 32px;
    button:nth-of-type(1) {
      line-height: 32px;
      width: 120px;
      height: 32px;
      background-color: #3c70d7;
      border-radius: 4px;
      padding: 0;
      font-size: 14px;
      color: #fff;
      float: left;
      margin-right: 16px;
      cursor: pointer;
      @include media($m1024) {
        margin-right: 2px;
      }
    }
    button:nth-of-type(2),
    button:nth-of-type(3) {
      width: 70px;
      height: 32px;
      cursor: pointer;
      background-color: #ffffff;
      border-radius: 4px;
      line-height: 32px;
      padding: 0;
      font-size: 14px;
      color: #303030;
      float: left;
      margin-right: 16px;
      @include media($m1024) {
        margin-right: 2px;
      }
    }
    button.cancalActive {
      width: 80px;
      height: 32px;
      cursor: pointer;
      background-color: #ffffff;
      border-radius: 4px;
      line-height: 32px;
      padding: 0;
      font-size: 14px;
      color: #303030;
      float: left;
      margin-right: 16px;
      @include media($m1024) {
        margin-right: 2px;
      }
    }
    select,
    .el-select {
      width: 120px;
      height: 32px;
      background-color: #ffffff;
      float: left;
      margin-right: 16px;
      border-radius: 4px;
      @include media($m1024) {
        margin-right: 2px;
      }
      text-align: center;
      text-align-last: center;
      input {
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        border: none;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
    .futureChecked,
    .showDetailChecked,
    .hotMapChecked,
    .hotMapSevenChecked {
      border-radius: 4px;
      display: inline-block;
      width: 71px;
      height: 32px;
      line-height: 32px;
      margin-right: 14px;
      text-align: center;
      background-color: #ffffff;
      vertical-align: middle;
      float: left;
      .el-checkbox__inner {
        border-radius: 50%;
      }
    }
    .showDetailChecked,
    .hotMapChecked,
    .hotMapSevenChecked {
      width: 104px;
    }
    >img {
      float: right;
      margin-top: 9px;
    }
    ul.fr {
      margin-top: 12px;
      font-size: 14px;
      color: #505050;
      margin-right: 20px;
      li {
        float: left;
        margin-left: 20px;
      }
      span {
        margin-left: 8px;
      }
    }
  }
  #normalMap {
    position: relative;
    overflow: hidden;
    height: auto;
    display: inline-block;
    >div {
      position: absolute;
      img {
        display: block;
        margin: 0 auto;
        cursor: pointer;
      }
      img.chooseImg {
        display: none;
        position: relative;
        z-index: 1;
      }
    }
    ul {
      @include position(absolute, 0, none, none, 49%);
      transform: translateX(-50%);
      z-index: 9;
      color: #fff;
      font-size: 12px;
      line-height: 14px;
      li {
        @include text-overflow();
      }
    }
  } // 地图
  .cardDiv {
    height: calc( 100% - 30px);
    overflow: auto;
    overflow-x: hidden;
    margin-top: 30px;
    width: 100%;
    @include media($m1366) {
      margin-top: 15px;
      height: calc( 100% - 22px);
    }
    #hotMapSevenMap {
      height: 100%;
    }
  }
  .mapOverview {
    width: 295px;
    opacity: .9;
    @include position(fixed, none, 5px, 5px, none);
    z-index: 9;
    >img {
      width: 100%;
    }
    >i {
      @include position(absolute, 50%, none, none, -38px);
      display: inline-block;
      transform: translateY(-50%);
      cursor: pointer;
      background: url('./assets/img/LightCtrl/hideSide.png') no-repeat center/100%;
      width: 38px;
      height: 44px;
    }
    >div {
      @include position(absolute,
      0,
      0,
      0,
      0);
    }
  }
  .overviewmapicon {
    @include position(fixed,
    none,
    5px,
    5px,
    none);
    background: url('./assets/img/LightCtrl/hide.png') no-repeat center/cover;
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
  .btnMoveOverview-enter-active,
  .btnMove-enter-active,
  .btnMoveRG-enter-active {
    animation: btnMove .2s reverse;
  }
  .btnMoveOverview-leave-to,
  .btnMove-leave-to,
  .btnMoveRG-leave-to {
    animation: btnMove .2s;
  }
  .sideMove-enter-active,
  .sideMoveRG-enter-active {
    animation: sideMove .5s;
  }
  .sideMove-leave-active,
  .sideMoveRG-leave-active {
    animation: sideMove .5s reverse;
  }
  .sideMoveOverview-enter-active {
    animation: sideMoveOverview .5s;
  }
  .sideMoveOverview-leave-active {
    animation: sideMoveOverview .5s reverse;
  }
  @keyframes btnMove {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes sideMove {
    0% {
      transform: translate(401px, -50%);
    }
    100% {
      transform: translate(0, -50%);
    }
  }
  @keyframes sideMoveOverview {
    0% {
      transform: translateX(401px);
    }
    100% {
      transform: translateX(0);
    }
  }
  .ctrlBox {
    .btn {
      @include position(fixed,
      47%,
      0,
      none,
      none);
      transform: scale(1);
      background: url('./assets/img/LightCtrl/ctrl.png') no-repeat 0 0;
      width: 48px;
      height: 48px;
      z-index: 1;
    }
    .side {
      z-index: 2;
      @include position(fixed,
      50%,
      0,
      none,
      none);
      transform: translateY(-50%);
      ul {
        @include position(relative,
        none,
        none,
        none,
        none);
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.18);
        border-radius: 8px;
        width: 320px;
        height: 405px;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 0 13px;
        li {
          border-bottom: 1px solid #c4c4c4;
          @include text-overflow;
          white-space: nowrap;
          height: 60px;
          line-height: 60px;
          font-size: 14px;
          color: #303030;
          padding: 0 17px;
        }
        li:nth-of-type(1) {
          @include position(absolute,
          40%,
          320px,
          none,
          none);
          border: none;
          height: auto;
          width: auto;
          padding: 0;
        }
        li:nth-of-type(2) {
          height: 77px;
          line-height: 77px;
          font-size: 16px;
          color: #2c5ac2;
        }
        li:nth-of-type(3) {
          >div:nth-of-type(2) {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            width: 190px;
            margin-left: 50px;
            span {
              width: 40px;
              height: 40px;
            }
            span:nth-of-type(1) {
              background: url('./assets/img/LightCtrl/ctrlLight.png') no-repeat 0 0;
              &.click {
                background: url('./assets/img/LightCtrl/ctrlLight.png') no-repeat -80px 0;
              }
            }
            span:nth-of-type(2) {
              background: url('./assets/img/LightCtrl/ctrlLight.png') no-repeat -40px 0;
              &.click {
                background: url('./assets/img/LightCtrl/ctrlLight.png') no-repeat -120px 0;
              }
            }
          }
        }
        li:nth-of-type(4) {
          >div:nth-of-type(2) {
            width: 70%;
            @include position(relative,
            none,
            none,
            none,
            none);
            margin-left: 54px;
            >span {
              color: #303030;
              @include position(absolute,
              40%,
              -24px,
              none,
              none);
              transform: translateY(-50%);
            }
          }
        }
        li:last-child {
          border: none;
          text-align: left;
          height: 188px;
          .default-brightness {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            width: 144px;
            margin: 0 auto;
            span {
              width: 46px;
              height: 46px;
              margin-bottom: 25px;
              &:nth-of-type(1) {
                margin-right: 52px;
                background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -184px 0;
                &.click {
                  background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat 0 0;
                }
              }
              &:nth-of-type(2) {
                background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -230px 0;
                &.click {
                  background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -46px 0;
                }
              }
              &:nth-of-type(3) {
                margin-right: 52px;
                background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -276px 0;
                &.click {
                  background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -92px 0;
                }
              }
              &:nth-of-type(4) {
                background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -322px 0;
                &.click {
                  background: url('./assets/img/LightCtrl/lightDefault.png') no-repeat -138px 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .ctrlBoxRG {
    .btn {
      // @include position(fixed,
      // 56%,
      // 0,
      // none,
      // none);
      position: fixed;
      top: 47%;
      background: url('./assets/img/LightCtrl/ctrl.png') no-repeat -48px 0;
      width: 48px;
      height: 48px;
    }
    .side ul {
      height: 320px;
      li:nth-of-type(5),
      li:nth-of-type(4) {
        >div:nth-of-type(2) {
          width: 60%;
          @include position(relative,
          none,
          none,
          none,
          none);
          margin-left: 75px;
          .el-slider {
            width: 142px;
            margin-right: -1px;
          }
          >span {
            @include position(absolute,
            40%,
            -24px,
            none,
            none);
            transform: translateY(-50%);
          }
        }
      }
      li:last-child {
        border: none;
        text-align: left;
        height: 60px;
        input[type=number] {
          width: 40px;
          height: 20px;
          font-size: 14px;
          background-color: #ffffff;
          margin: 0 6px 0 24px;
          text-align: center;
          vertical-align: middle;
        }
      }
    }
  }
  div.el-dialog {
    width: 1004px !important;
  }
  .RightOne {
    width: 100%;
    height: 200px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    @include media($m1366) {
      margin-bottom: 20px; // height: 300px;
    }
    .RightCon {
      &:nth-of-type(2) {
        margin: 0 30px;
      }
      width: 294px;
      height: 218px;
      float: left;
    }
  }
  .RightTwo {
    width: 100%;
    height: 220px;
    .eneryAn {
      text-align: center;
      font-size: 14px;
      width: 100%;
    }
    .energyChart {
      width: 100%;
      height: 220px;
    }
  }
}
</style>
