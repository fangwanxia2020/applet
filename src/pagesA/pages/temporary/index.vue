<template>
  <view class="content">
		<image class="content_back" :src="back" mode="widthFix"></image>
		<view class="content_text">
			<view class="">
				{{total}}
			</view>
			<text>总任务数</text>
		</view>
		<view class="content_list">
			<view class="content_list_item" @click="reportShow = true">
				<view class="">
					剩余时间：
				</view>
				<view class="content_list_item_icon">
					<text>
						{{reportText}}
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
		
		<view  @click="goDetail(item.id)"  class="list-box" v-for="(item,index) in listData" :key="item.id">
			<view class="list-btn clearfix">
				<view class="left">
					<span class="sign">{{['特急','加急','普通'][item.urgency]}}</span>
				</view>
			</view>
			<view class="list-content">
				<view class="list-content-title">
					{{item.name}}
				</view>
				<view class="list-content-cont">
					{{item.taskContent}}
				</view>
				<view class="list-content-time">
					截止: {{item.deadlineTime.slice(0,16)}}
					<text>剩余：{{item.comingToEndDateTime}}</text>
				</view>
			</view>
		</view>
		
		<u-picker 
		:show="reportShow" 
		:columns="reportColumns"
		closeOnClickOverlay
		keyName="label"
		@confirm="reportConfirm"
		@cancel="reportShow = false"
		@close="reportShow = false"
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
		<u-loadmore :status="status" />
  </view>
</template>

<script>
import back from '@/static/images/pageA/back1.png'
import { sys_org , listComingToEndTask } from "@/api/pagesA/temporary.js"
export default {
  data() {
    return {
			back,
      chartData: {},
			listData:{},
			value:'',
			tableData1:[],
			tableData2:[],
			reportShow:false,
			startShow:false,
			reportColumns: [ 
				[{
					value: 3,
					label: '3天以内'
				},
				{
					value: 7,
					label: '7天以内'
				},
				{
					value: 30,
					label: '30天以内'
				},
				{
					value: '',
					label: '所有逾期'
				}]
			],
			startColumns:[],
			reportText:'3天以内',
			startText:'',
			formData: {
				pageNum: 1,
				pageSize: 10,
				query: {
						dateNum: 3,
						orgId: ''
				}
			},
			total: 0,
			listTotal: 0,
			status: 'loadmore'
    };
  },
  onReady() {
  },
	async onLoad() {
		await this.init()
	},
	onReachBottom() {
		console.log("this.listTotal456", )
		if (this.total == this.listTotal) {
			this.status = 'nomore';
			return
		}
		this.status = 'loading';
		this.formData.pageNum = ++this.formData.pageNum;
		this.listOverdueTask()
	},
  methods: {
	  goDetail(id){
		  console.log("id",id)
		  uni.navigateTo({
		  	url:`/pagesA/pages/temporary/detail?id=${id}`
		  
		  })
	  },
		async init(){
			const res =  await sys_org()
			this.startColumns.push(res.data)
			this.startText = res.data[0].name
			this.formData.query.orgId = res.data[0].id
			this.listOverdueTask()
		},
		async listOverdueTask(){
			const res = await listComingToEndTask(this.formData)
			// this.listData = res.data.list
			if (this.status == 'loading') {
				this.listData = [...this.listData, ...res.data.list]
			} else {
				this.listData = res.data.list
			}
			if (this.total == this.listTotal) {
				this.status = 'nomore';
						
			}
		
			this.listTotal = this.listData.length
		
			this.total = res.data.pagination.total
		},
		reportConfirm(e){
			this.formData.query.dateNum = e.value[0].value
			this.reportText = e.value[0].label
			this.reportShow = false
			this.listOverdueTask()
		},
		startConfirm(e){
			this.formData.query.orgId = e.value[0].id
			this.startText = e.value[0].name
			this.startShow = false
			this.listOverdueTask()
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
			height: 328rpx;
			top:calc(var(--status-bar-height) - 10px);
		}
		&_text{
			position: absolute;
			top: 140rpx;
			left: 50rpx;
			color: #fff;
			view{
				font-size: 44rpx;
			}
			text{
				font-size: 30rpx;
			}
		}
		&_list{
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
		.list-box {
			border-radius: 10rpx;
			width: 100%;
			background-color: #FFFFFF;
			padding: 20rpx;
			margin-bottom: 16rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			.list-btn {
				margin-bottom: 6rpx;
				overflow: hidden;
				width: 100%;
				span {
					color: #026DFF;
					padding: 6rpx 12rpx;
					background-color: rgb(204,226,255);
					box-sizing: content-box;
					margin: 0 6rpx;
					font-size: 24rpx;
					border-radius: 6rpx;
				}
				.sign{
					color: #F7534F;
					font-size: 24rpx;
					background-color: rgb(253,221,220);
				}
			}
			.list-content{
				.list-content-title{
					font-size: 30rpx;
					font-weight: bold;
				}
				.list-content-cont{
					font-size: 26rpx;
					color: #666666;
				}
				.list-content-time{
					font-size: 24rpx;
					text{
						color: #026DFF;
						margin-left: 20rpx;
					}
				}
			}
			
		}
	}
 
</style>
