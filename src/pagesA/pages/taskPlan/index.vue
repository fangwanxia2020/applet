<template>
	<view class="content">
		<view class="table_tabs">
			<view v-for="(item , index) in listArry" :key="index" style="padding-bottom: 14rpx;"
				:class="item.active?'active':''"  @click="changTab(index)">
				<view class="tab_text">{{item.label}}</view>
				<view class="tab_text">{{item.value}}项</view>
			</view>
		</view>
		<view class="list-box" v-for="(item) in listData" :key="item.id" @click="next('/pagesA/pages/taskPlan/details?id='+item.id)">
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
					<text :class="item.comingToEndDateType?'item_2_2':'item_2_3'">{{item.comingToEndDateType?'剩余：':'逾期：'}}{{item.comingToEndDateTime}}</text>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	import { getTask , getCount } from "@/api/pagesA/taskPlan"
	export default{
		data(){
			return {
				listData:[],
				formData: {
					pageNum: 1,
					pageSize: 10,
					query: {
						dateType: 1,
					}
				},
				listArry: [{
					value: '',
					label: '今天有进度',
					date:1,
					active: true
				},
				{
					value:'',
					label: '3天内进度',
					date:2,
					active: false
				},
				{
					value: '',
					label: '7天内进度',
					date:3,
					active: false
				},
				{
					value: '',
					label: '7天外进度',
					date:4,
					active: false
				},
				{
					value: '',
					label: '超7天进度',
					date:5,
					active: false
				}],
				total: 0,
				status: 'loadmore'
			}
		},
		onReachBottom() {
			if(this.dataNum == this.listData.length) return ;
			this.status = 'loading';
			this.formData.pageNum = ++ this.formData.pageNum;
			this.getList()
		},
		onLoad(){
			this.getList()
			this.getCount()
		},
		methods:{
			async getList() {
				const res = await getTask(this.formData)
				this.listData.push(...res.data.list)
				this.dataNum = res.data.pagination.total
				if(this.dataNum == this.listData.length) this.status = 'nomore';
			},
			async getCount(){
				const res = await getCount('task')
				for( let index in res.data){
					this.listArry[index].value = res.data[index]
				}
			},
			changTab(index){
				this.formData.pageNum = 1
				this.formData.pageSize = 10
				this.listData.length = 0
				for(let i  in this.listArry ){
					if(this.listArry[index].active == this.listArry[i].active && this.listArry[index].active== true){
						return
					}
					this.listArry[i].active = false
				}
				this.formData.query.dateType = this.listArry[index].date
				this.listArry[index].active = true
				this.getList()
			},
			next(url){
				uni.navigateTo({url})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 0;
		.table_tabs {
			background-color: #FFFFFF;
			text-align: center;
			border: 1rpx solid #eeeeee;
			display: flex;
			justify-content: space-between;
			font-size: 12rpx;
			padding: 14rpx 10rpx;
			padding-bottom: 0;
		
			.tab_text {
				font-size: 24rpx;
				line-height: 50rpx;
			}
		}
		.active {
			color: rgb(0, 121, 254);
			border-bottom: 1rpx solid rgb(0, 121, 254);
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