<template>
  <view class="content">
		<image class="content_back" :src="back" mode="widthFix"></image>
  	<view class="charts-box">
  	  <qiun-data-charts 
  	    type="radar"
  	    :opts="opts"
  	    :chartData="chartData"
  	  />
  	</view>
		<view class="content_list">
			<view class="content_list_item" @click="reportShow = true">
				<view class="">
					报表类型：
				</view>
				<view class="content_list_item_icon">
					<text>
						{{reportText}}
					</text>
					<u-icon name="arrow-right" color="#999999" size="18" ></u-icon>
				</view>
			</view>
			<view class="content_list_item" @click="dateShow = true">
				<view class="">
					筛选时间：
				</view>
				<view class="content_list_item_icon">
					<text>
						{{dateText}}
					</text>
					<u-icon name="arrow-right" color="#999999" size="18" ></u-icon>
				</view>
			</view>
			<view class="content_list_item" @click="startShow = true">
				<view class="">
					局办：
				</view>
				<view class="content_list_item_icon">
					<text>
						{{startText}}
					</text>
					<u-icon name="arrow-right" color="#999999" size="18" ></u-icon>
				</view>
			</view>
		</view>
		<view class="content_tab">
			<view class="content_tab_text">
				任务情况
			</view>
			<view class="content_tab_list">
				<view class="content_tab_list_item" v-for="(item,index) in tableData2" :key="index">
					<view class="">
						{{item.name}}
					</view>
					<view class="">
						{{item.num}}
					</view>
				</view>
			</view>
			<view class="content_tab_area">
				同比<text 
				:class="info.compareToLastTime > 100 ? 'up_color':'down_color'"
				>{{info.compareToLastTime}}% {{info.compareToLastTime > 100 ? '↑':'↓'}}</text>
			</view>
		</view>
		<view class="content_tab">
			<view class="content_tab_text">
				监督情况
			</view>
			<view class="content_tab_list">
				<view class="content_tab_list_item" v-for="(item,index) in tableData1" :key="index">
					<view class="">
						{{item.name}}
					</view>
					<view class="">
						{{item.num}}
					</view>
				</view>
				
			</view>
		</view>
		<u-picker 
		:show="reportShow" 
		:columns="reportColumns"
		closeOnClickOverlay
		@confirm="reportConfirm"
		@cancel="reportShow = false"
		@close="reportShow = false"
		></u-picker>
		
		<u-picker
		:show="dateShow" 
		:columns="dateColumns"
		closeOnClickOverlay
		keyName="date"
		@confirm="dateConfirm"
		@cancel="dateShow = false"
		@close="dateShow = false"
		></u-picker>
		
		<u-picker
		:show="startShow" 
		:columns="startColumns"
		closeOnClickOverlay
		keyName="name"
		@confirm="startConfirm"
		@cancel="startShow = false"
		@close="startShow = false"
		></u-picker>
		
  </view>
</template>

<script>
import back from '@/static/images/pageA/back.png'
import { sys_org , getTaskOverview } from "@/api/pagesA/taskOverview"
export default {
  data() {
    return {
			back,
      chartData: {},
			info:{},
			value:'',
			tableData1:[],
			tableData2:[],
			reportShow:false,
			startShow:false,
			dateShow:false,
			reportColumns: [
				['周报', '月报', '季报','半年报','年报']
			],
			startColumns:[],
			dateColumns:[],
			reportText:'周报',
			startText:'',
			dateText:'',
      opts: {
        padding: [5,5,5,5],
        dataLabel: false,
        legend: {
          show: false,
          position: "right",
          lineHeight: 25
        },
        extra: {
          radar: {
            gridType: "radar",
            gridColor: "#CCCCCC",
            labelColor: "#ffffff",
            gridCount: 3,
            opacity: 0.9,
            max: 10,
            border: true
          }
        }
      }
    };
  },
  onReady() {
  },
	async onLoad() {
		await this.initWeek()
		await this.init()
	},
  methods: {
		async init(){
			const res =  await sys_org()
			this.startColumns.push(res.data)
			this.startText = res.data[0].name
			this.orgId = res.data[0].id
			this.dateCounter()
		},
		async getTaskOverview(data){
			data.orgId = this.orgId
			const res = await getTaskOverview(data)
			this.info = res.data
			let arr = [res.data.efficiency,res.data.accuracy,res.data.responsivity,res.data.quality]
			this.getServerData(arr);
			this.tableData1 = [{
				num:res.data.attentionTask,
				name:'被关注数'
			},{
				num:res.data.urgeTask,
				name:'被督办数'
			},{
				num:res.data.updateProgressTask,
				name:'更新进展数'
			}]
			this.tableData2 = [{
				num:res.data.newTask,
				name:'新任务'
			},{
				num:res.data.overdueTask,
				name:'逾期任务'	
			
			},{
				num:res.data.nearExpireTask,
				name:'临期任务'
			}]
		},
		dateConfirm(e){
			console.log(e.value[0])
			this.dateText = e.value[0].date
			this.value = e.value[0].value
			this.dateShow = false
			this.dateCounter()
		},
		reportConfirm(e){
			this.reportText = e.value[0]
			this.reportShow = false
			this.dateColumns.length = 0
			switch (this.reportText){
				case '周报'://周报
					this.initWeek()
					break;
				case '月报'://月报
					this.initMonth()
					break;
				case '季报'://季报
					this.initQuarter()
					break;
				case '半年报'://半年报
					this.initSemester()
					break;
				case '年报'://年报
					this.initYear()
					break;
			}
			this.dateCounter()
		},
		startConfirm(e){
			this.orgId = e.value[0].id
			this.startText = e.value[0].name
			this.startShow = false
			this.dateCounter()
		},
		async dateCounter(){
			let moment = this.moment
			let data = {}
			switch (this.reportText){
				case '周报'://周报
					// this.initWeek()
					let date = JSON.parse(this.value)
					data = {...date}
					console.log(date)
					console.log(data)
					data.beginTime = data.beginTime + " 00:00:00"
					data.endTime = data.endTime + " 23:59:59"
					data.lastBeginTime = moment(data.beginTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
					data.lastEndTime = moment(data.endTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
					break;
				case '月报'://月报
					data.beginTime = this.value
					data.endTime = moment(this.value).endOf('month').format("YYYY-MM-DD HH:mm:ss") 
					data.lastBeginTime = moment(data.beginTime).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss')
					data.lastEndTime = moment(moment(data.endTime).subtract(1,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
					break;
				case '季报'://季报
					data.beginTime = this.value
					data.endTime = moment(moment().format(data.beginTime)).endOf('quarter').format("YYYY-MM-DD HH:mm:ss")
					data.lastBeginTime = moment(data.beginTime).subtract(3,'months').format('YYYY-MM-DD HH:mm:ss')
					data.lastEndTime =  moment(moment(data.endTime).subtract(3,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
					break;
				case '半年报'://半年报
					data.beginTime = this.value
					data.endTime = moment(moment(data.beginTime).add(5,'months').endOf('months')).format("YYYY-MM-DD HH:mm:ss")
					data.lastBeginTime = moment(data.beginTime).subtract(6,'months').format('YYYY-MM-DD HH:mm:ss')
					data.lastEndTime = moment(moment(data.endTime).subtract(6,'months')).endOf('months').format('YYYY-MM-DD HH:mm:ss')
					break;
				case '年报'://年报
					data.beginTime = this.value
					data.endTime = moment().endOf("year").format('YYYY-MM-DD HH:mm:ss')
					data.lastBeginTime = moment(data.beginTime).subtract(1,'year').format('YYYY-MM-DD HH:mm:ss')
					data.lastEndTime = moment(data.endTime).subtract(1,'year').format('YYYY-MM-DD HH:mm:ss')
					break;
			}
			console.log(data)
			await this.getTaskOverview(data)
		},
    getServerData(arr) {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
            categories: ["效率","精准度","响应度","质量"],
            series: [
              {
                name: "",
								color:'#2D7BFC',
                data: arr
              }
            ]
          };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    },
		//年报
		initYear(){
			let moment = this.moment
			let currentYear = moment().year()
			let monthData = [{
				date:`${currentYear}年`,
				value:`${currentYear}-01-01 00:00:00`
			}] 
			this.dateColumns.push(monthData)
			this.value = monthData[monthData.length-1].value
			this.dateText = monthData[monthData.length-1].date
			
		},
		//半年报
		initSemester(){
			let moment = this.moment
			let currentYear = moment().year() 
			let monthData = [{
				date:`${currentYear}年上半年`,
				value:`${currentYear}-01-01 00:00:00`
			}]
			let monthNum = moment().format("MM")
			if(monthNum >= 7){
				let obj ={
					date:`${currentYear}年下半年`,
					value:`${currentYear}-07-01 00:00:00`
				}
				monthData.push(obj)
			}
			this.dateColumns.push(monthData)
			this.value = monthData[monthData.length-1].value
			this.dateText = monthData[monthData.length-1].date
		},
		//季度报
		initQuarter(){
			let moment = this.moment
			let quarterData = []
			let quarterNum = moment().quarter()
			let currentYear = moment().year() // 当前年
			for (let i = 0; i < quarterNum; i++) {
				let obj = {}
				obj.date = `${moment().format('YYYY')}年第${i+1}季`
				obj.value = `${currentYear}-${i*3 + 1}-01 00:00:00`
				quarterData.push(obj)
			}
			this.dateColumns.push(quarterData)
			this.value = quarterData[quarterData.length-1].value
			this.dateText = quarterData[quarterData.length-1].date
		},
		//月报
		initMonth(){
			let moment = this.moment
			let monthData = []
			let monthNum = moment().format("MM")
			for (let i = 0; i < monthNum; i++) {
				let obj = {}
				obj.date = `${moment().format('YYYY')}年第${i+1}月`
				obj.value = `${moment().format('YYYY')}-${i+1}-01 00:00:00`
				monthData.push(obj)
			}
			this.dateColumns.push(monthData)
			this.value = monthData[monthData.length-1].value
			this.dateText = monthData[monthData.length-1].date
		},
		//周报
		initWeek(){
			let moment = this.moment
			// 对起止时间进行处理
			let beginTime = new Date(moment().format('YYYY')+'-01-01');
			// console.log(moment().format('YYYY')+'-01-01')
			let weekOfday1 = moment().format('E');
			//获取本周周末的日期
			let endTime = new Date(moment().add(7 - weekOfday1, 'days').format('YYYY-MM-DD'))
			// 开始时间
			let bY = beginTime.getFullYear();
			let bM = beginTime.getMonth() + 1;
			bM = bM >= 10 ? bM : "0" + bM;
			let bD = beginTime.getDate();
			bD = bD >= 10 ? bD : "0" + bD;

			// 结束时间
			let eY = endTime.getFullYear();
			let eM = endTime.getMonth() + 1;
			eM = eM >= 10 ? eM : "0" + eM;
			let eD = endTime.getDate();
			eD = eD >= 10 ? eD : "0" + eD;

			let week = moment(`${eY}-${eM}-${eD}`).week() - moment(`${bY}-${bM}-${bD}`).week(); // 计算周数 用来循环
			let weekOfDay = new Date(`${bY}-${bM}-${bD}`).getDay(); // 获取当前周几
			let weekDate = [] // 存放结果数据

			for (let i = 0; i < week; i++) {
				let next_monday = '', next_sunday = '', obj = {};
				next_monday = i == 0 ? `${bM}-${bD}` : moment(`${bY}-${bM}-${bD}`).add((7 - weekOfDay) + 7 * (i - 1) + 1, 'd').format('MM-DD'); 
				next_sunday = i == week - 1 ? `${eM}-${eD}` : moment(`${bY}-${bM}-${bD}`).add((7 - weekOfDay) + 7 * i, 'd').format('MM-DD');
				obj.date = `${moment().format('YYYY')}年第${i+1}周 ${next_monday} ~ ${next_sunday}`
				obj.value = JSON.stringify({'beginTime':`${moment().format('YYYY')}-${next_monday}`,'endTime':`${moment().format('YYYY')}-${next_sunday}`})
				weekDate.push(obj)
			}
			this.dateColumns.push(weekDate)
			this.value = weekDate[weekDate.length-1].value
			this.dateText = weekDate[weekDate.length-1].date
		},
  }
};
</script>

<style lang="scss" scoped>
	.content{
		height: 100vh;
		position: relative;
		background: linear-gradient(0deg, #0596FF 0%, #485CF1 100%);
		&_back{
			width: 100%;
			position: absolute;
			z-index: 0;
			top:calc(var(--status-bar-height) - 10px);
		}
		.charts-box {
			
		  width: 100%;
		  height: 240px;
		}
		&_list{
			position: relative;
			z-index: 20;
			background: #fff;
			font-size: 26rpx;
			color: #333333;
			border-radius: 10rpx;
			&_item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 90rpx;
				margin: 0 40rpx;
				border-bottom: 1rpx solid #DCDCDC;
				box-sizing: border-box;
				&_icon{
					display: flex;
					align-items: center;
					color: #999999;
					text{
						margin-right: 20rpx;
					}
				}
			}
		}
		&_tab{
			color: #333333;
			background: #fff;
			border-radius: 10rpx;
			margin-top: 20rpx;
			padding: 30rpx 0;
			&_text{
				font-size: 32rpx;
				font-weight: bold;
				margin-left: 30rpx;
				margin-bottom: 30rpx;
			}
			&_list{
				display: flex;
				align-items: center;
				&_item{
					width: 33.3%;
					height: 110rpx;
					font-size: 28rpx;
					text-align: center;
					border-right: 1rpx solid #CCCCCC;
					view:nth-of-type(2){
						font-weight: bold;
						font-size: 36rpx;
					}
				}
			}
			&_area{
				font-size: 24rpx;
				margin-left: 30rpx;
				margin-top: 10rpx;
				text{
					margin-left: 10rpx;
				}
				.up_color{
					color: rgb(251,98,96);
				}
				.down_color{
					color: #36eb3f;
				}
			}
		}
	}
 
</style>