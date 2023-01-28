<template>
	<view>
	<view>
		<view class="list-box" >
			<view class="list-btn clearfix">
				<view class="left">
					<span>{{taskObj.principalIds.length>1 ? '多人':'单人'}}</span>
					<span>{{taskObj.taskTypeName}}</span>
					<span class='sign'>{{taskObj.urgencyName}}</span>
				</view>

				<view class="iconBox " @click="goIssue">
						<u-icon name='more-dot-fill' size="18"></u-icon>
				
				</view>



				<view class="right">
					<!-- <switch checked color="#2b85ff" style="transform:scale(0.7)" /> -->
				<!-- 	<zz-switch @switchFunction="switchChangeFun" style="transform:scale(0.8)" :defaultColor="'#2b85ff'"
						:highColor="'#FFFFFF'" :defaultValue="taskObj.enable" :switchList="switchListText"
						:itemIndex="0"></zz-switch> -->
						<zz-switch text="启用|停用" :value='taskObj.enable' :sid='taskObj.enable' @change='switchChangeFun'></zz-switch>
				</view>


			</view>
			<view class="list-content" >
				<view @click="goDetail1()">
				<view class="list-content-title">
					{{taskObj.name}}
				</view>
				<view class="list-content-cont">
					{{taskObj.taskContent}}
				</view>
				<!-- <view class="list-content-time">截止:{{taskObj.periodicEndTime.slice(0,16)}} -->
				
				</view>
				</view>
				<view class="list-content-time time-postion">
					<text>已下发次数:{{taskObj.taskReleasesNum}}</text>
				<view class='heartBox'>
					<view class="heartIcon list-content-progress-handel" @click="isAttention">
						<image style="width: 27rpx;height: 24rpx;"  :src="concern_hl" mode="widthFix" v-if="taskObj.isAttention == 1"></image>
						<image style="width: 27rpx;height: 24rpx;"  :src="concern" mode="widthFix" v-if="taskObj.isAttention == 0"></image>
					</view>
				</view>
				</view>
			
			</view>
		</view>

		<u-popup  :show="show" mode="bottom" closeable="true"  @close='closePopup'>
			<view class="popup_box">
					<view class="popup_box_text">
						{{taskObj.name}}
					</view>
					<view  class="popup_box_list"@click="goDetail">
						<image :src="missionFail" mode="widthFix"></image>
						<span>周期下发详情</span>
					</view>
				
				</view>
			</u-popup>
	
			
	</view>
	</view>
</template>

<script>

	import zzSwitch from '@/components/zz-switchc/zz-switchc'
	import concern from '@/static/images/pageA/concern.png'
	import concern_hl from '@/static/images/pageA/concern_hl.png'
	import missionFail from '@/static/images/pageA/missionFail.png'
	import {
		changeEnable,
		attention,
		respTask
	} from "@/api/pagesA/period-task"
	export default {
		components: {
		
			zzSwitch
		},
		props: ['taskObj'],
		data() {
			return {
				missionFail,
				concern,
				concern_hl,
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
					enable: e.sid == 1? 0 : 1
				}
				const res = await changeEnable(obj)
				this.$emit('changeEnable')

			},
			// 是否关注
			async isAttention() {
				let obj = {
					periodicTaskId: this.taskObj.id,
					attention: this.taskObj.isAttention == 0 ? 1 : 0
				}
				const res = await attention(obj)
				this.$emit('changeEnable')
			},
			 goIssue() {
				this.show = true
			
				
			},
			goDetail(e){
				uni.navigateTo({
					url:`/pagesA/pages/periodTask/issue-detail?id=${this.taskObj.id}`
				
				})
				this.show  =false
			},
			goDetail1(e){
				uni.navigateTo({
					url:`/pagesA/pages/periodTask/detail-1?id=${this.taskObj.id}`
				
				})
			},
			closePopup(){
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .list-content-progress-handel{
	width: 120rpx;
	text-align: right;
	 image {
		width: 50rpx;
		height: 50rpx;
		
	}
}

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
.time-postion{
	position: relative;
	
}
	::v-deep .heartBox {
		height: 50rpx;
		overflow: hidden;
position: absolute;
    top: 0;
    right: 0;
		.heartIcon {
			width: 50rpx;
			height: 50rpx;
			
		}
	}

	.iconBox {
		display: inline-block;
		line-height: 50rpx;
		height: 50rpx;
		width: 40rpx;
		float: right;
		text-align: center;
		margin-left: 20rpx;
		padding-top: 10rpx;
	}
.popup_box{
	font-size: 30rpx;
	color: #333;
	padding: 0 10rpx;
	&_text{
		font-weight: bold;
		height:100rpx;
		line-height: 100rpx;
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	&_list{
		height:100rpx;
		line-height: 100rpx;
		display: flex;
		align-items:center;
		justify-content:center;
		border-top: 2rpx solid #E6E6E6;
		image{
			width: 30rpx;
			margin-right: 49rpx;
		}
	}
}
	

</style>
