<template>
	<view>
		<view class="list-box">
			<view class="list-btn clearfix">
				<view class="left">
			
				<span class='sign' v-if="type == 50 && taskObj.commit == '6' ">被驳回</span>
				<span  v-if="type == 50 && taskObj.commit == '7' ">已通过</span>
					
					
					<span>{{taskObj.taskTypeName}}</span>
					<span class='sign'>{{taskObj.urgencyName}}</span>
				</view>


			</view>
			<view class="list-content" @click="goDetail">
				<view class="list-content-title">
					{{taskObj.name}}
				</view>
				<view class="list-content-cont">
					
					{{taskObj.taskContent}}
				</view>
				<view class="list-content-time">截止:{{taskObj.deadlineTime.slice(0,16)}}
				<text class="list-content-status" :class="taskObj.statusClass">{{taskObj.statusName}}</text>
				</view>
				<view class="list-content-time">负责人:{{taskObj.responsiblePersonName}}</view>
			</view>
		</view>
	

	</view>
</template>

<script>

	import {
		changeEnable,
		attention,
		respTask
	} from "@/api/pagesA/period-task"
	export default {

		props: ['taskObj',"type"],
		data() {
			return {
				show: false,
				array:[],
				//设置默认值
				switchDefaultValue: 0,
				//文本switch的可选值，仅支持2个数组
				switchListText: [{
						title: '启用',
						value: 1
					},
					{
						title: '停用',
						value: 0
					}
				],

			}
		},
		onShow() {

		},
		methods: {
			//切换事件
			async switchChangeFun(e) {
				console.log('触发 switchChangeFun');
				console.log(e);
				//重新赋值，改变该值用于设置switch默认值
				let obj = {
					id: this.taskObj.id,
					enable: e.swithcSelectItem.value
				}
				const res = await changeEnable(obj)
				this.$emit('changeEnable')

			},
			// 是否关注
			async isAttention() {
				let obj = {
					id: this.taskObj.id,
					isAttention: this.taskObj.isAttention == 0 ? 1 : 0
				}
				const res = await attention(obj)
				this.$emit('changeEnable')
			},
			 goIssue() {
				this.show = true
			
				
			},
			goDetail(e){
				if(this.type == 40){
					uni.navigateTo({
						url:`/pagesA/pages/audit/audit-detail?id=${this.taskObj.id}&taskInstanceId=${this.taskObj.taskInstanceId}`
					
					})
				}else if(this.type == 50){
					uni.navigateTo({
						url:`/pagesA/pages/completed/detail?id=${this.taskObj.id}&taskInstanceId=${this.taskObj.taskInstanceId}&commit=${this.taskObj.commit}`
					
					})
				}
			this.show = false
			},
			closePopup(){
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-box {
		border-radius: 10rpx;
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx;
		margin-bottom: 16rpx;
		box-sizing: border-box;
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
				background-color: rgb(253,221,220);
			}
		}
	}

	.list-content {


		.list-content-title {
			line-height: 50rpx;
			height: 50rpx;
			width: 100%;
			white-space: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: #333333;
			font-size: 30rpx;
			font-weight: 600;

		}

		.list-content-cont {
			line-height: 50rpx;
			height: 50rpx;
			width: 100%;
			white-space: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: #6b6b6b;
			font-size: 30rpx;
		}

		.list-content-time {
			line-height: 50rpx;
			height: 50rpx;
			font-size: 24rpx;
			color: #4a4a4a;
			.list-content-status{
				margin-left: 20rpx;
			}
			.blue{
				color: #026DFF;
			}
			.red{
				color: #F7534F;
			}
		}
	}

	::v-deep .heartBox {
		height: 50rpx;
		overflow: hidden;

		.heartIcon {
			width: 50rpx;
			height: 50rpx;
			float: right;
		}
	}

	.iconBox {
		display: inline-block;
		line-height: 50rpx;
		height: 50rpx;
		width: 60rpx;
		float: right;
		text-align: center;
		margin-left: 10rpx;
		padding-top: 10rpx;
	}
	::v-deep  .u-popup  {
		
		.u-transition{
			height: 200rpx;
		}
	}
</style>
