<template>
	<view style="position: relative;">
		<view class="img-box">
			<u--image :showLoading="true" :src="my" width="80px" height="80px"></u--image>
			<view style="color: #FFFFFF;">{{info.name || ''}}</view>
		</view>
		<view class="form_list">
			<view class="form_list_item" style="border:none">
				<view class="form_list_item_img">
					<view>
						<image :src='my_1' mode="widthFix"></image>
					</view>
					<text>组织</text>
				</view>
				<view><text>{{info.orgName || ''}}</text></view>
			</view>
			<view class="form_list_item">
				<view class="form_list_item_img">
					<view>
						<image :src='my_2' mode="widthFix"></image>
					</view>
					<text>部门</text>
				</view>

				<view><text>{{infoData.deptName || ''}}</text></view>
			</view>
			<view class="form_list_item">
				<view class="form_list_item_img">
					<view>
						<image :src='my_5' mode="widthFix"></image>
					</view>
					<text>手机号码</text>
				</view>

				<view><text>{{info.phone || ''}}</text></view>
			</view>
			<view class="form_list_item">
				<view class="form_list_item_img">
					<view>
						<image :src='my_6' mode="widthFix"></image>
					</view>
					<text>员工工号</text>
				</view>

				<view><text>{{info.code || ''}}</text></view>
			</view>
			<view class="form_list_item">
				<view class="form_list_item_img">
					<view>
						<image :src='my_3' mode="widthFix"></image>
					</view>
					<text>修改密码</text>
				</view>
				<view class="icon">
					<u-icon name="arrow-right" color="rgb(67, 68, 71)" size="18"></u-icon>
				</view>
			</view>
			<view class="form_list_item" @click="logOut">
				<view class="form_list_item_img">
					<view>
						<image :src='my_4' mode="widthFix"></image>
					</view>
					<text>退出登录</text>
				</view>
				<view class="icon">
					<u-icon name="arrow-right" color="rgb(67, 68, 71)" size="18"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		TOKEN_KEY
	} from '@/api/http'
	import { myInfo,profile } from "@/api/pages/myCenter.js"
	import my_1 from '@/static/images/page/my_1.png'
	import my from '@/static/images/page/my.png'
	import my_2 from '@/static/images/page/my_2.png'
	import my_3 from '@/static/images/page/my_3.png'
	import my_4 from '@/static/images/page/my_4.png'
	import my_5 from '@/static/images/page/my_5.png'
	import my_6 from '@/static/images/page/my_6.png'
	export default {
		data() {
			return {
				src: 'https://cdn.uviewui.com/uview/album/1.jpg',
				my_1,
				my_2,
				my_3,
				my_4,
				my_5,
				my_6,
				my,
				info:{},
				infoData:{}
			}
		},
	
		onLoad(){
			this.getInfo()
		},
		methods: {
			logOut() {

				uni.removeStorageSync(TOKEN_KEY)
				uni.removeStorageSync('USER_ID') 
				uni.reLaunch({
					url: '/pages/login/index'
				});

			},
			async getInfo(){
				const res = await profile()
				
				this.infoData = res.data
				const ress = await myInfo(res.data.personId)
				this.info = ress.data
				console.log("info",this.info)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-box {
		width: 100%;
		height: 360rpx;
		display: flex;
		background-size: 100% 400rpx;
		background-image: url(../../static/images/page/myBg.png);
		justify-content: center;
		flex-direction: column;
		align-items: center;

	}

	.form_list {
		border-bottom: 1px solid #eeeeee;
		background-color: #FFFFFF;
		position: absolute;
		top: 320rpx;
		border-radius: 20rpx 20rpx 0 0;
		width: 100%;
		padding-top: 30rpx;

		&_item {
			height: 70rpx;
			display: flex;
			line-height: 70rpx;
			justify-content: space-between;
			border-top: 1px solid #eeeeee;
			padding: 20rpx;

			text {
				display: block;
				margin-left: 20rpx;
				height: 70rpx;
				line-height: 70rpx;
			}

			&_img {
				display: flex;

				view {
					height: 70rpx;
					padding-top: 10rpx;
				}
			}
		}
	}

	image {
		width: 50rpx;
		height: 50rpx;

	}

	::v-deep .icon {
		line-height: 70rpx;

		text {
			line-height: 70rpx !important;
		}
	}
</style>
