<template>
  <view class="content">
		<image class="content_back" :src="back" mode="widthFix"></image>
		<view class="content_text">
			<view class="">
				{{listData.length}}
			</view>
			<text>总逾期数</text>
		</view>
		<view class="content_list">
			<view class="content_list_item" @click="reportShow = true">
				<view class="">
					逾期时间：
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
		
		<view class="list-box" v-for="(item,index) in listData" :key="item.id" @click="next('/pagesA/pages/taskPlan/details?id='+item.id)">
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
					截止: {{item.deadlineTime.substring(0, 16)}}
					<text :class="item.comingToEndDateType?'item_2_2':'item_2_3'">{{item.comingToEndDateType?'剩余：':'已逾期：'}}{{item.comingToEndDateTime}}</text>
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
		
  </view>
</template>

<script>
import back from '@/static/images/pageA/back1.png'
import { sys_org , listOverdueTask } from "@/api/pagesA/overdueTask"
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
    };
  },
  onReady() {
  },
	async onLoad() {
		await this.init()
	},
  methods: {
		async init(){
			const res =  await sys_org()
			this.startColumns.push(res.data)
			this.startText = res.data[0].name
			this.formData.query.orgId = res.data[0].id
			this.listOverdueTask()
		},
		async listOverdueTask(){
			const res = await listOverdueTask(this.formData)
			this.listData = res.data.list
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
		next(url){
			uni.navigateTo({url})
		}
  }
};
</script>

<style lang="scss" scoped>
	.content{
		min-height: 100vh;
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
						margin-left: 20rpx;
					}
					.item_2_2{
						color: #026DFF;
					}
					.item_2_3{
						color: #F7534F;
					}
				}
			}
			
		}
	}
 
</style>