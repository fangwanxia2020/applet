<template>
	<view class="box111">
		<u-popup closeable mode="bottom"  :show.sync="moveShow" @close="$emit('update:moveShow', false)">
			<view class="popup_box">
					<view class="popup_box_text">
						上传附件
					</view>
					<view class="popup_box_list" 
					 @click="handlechoose('wx')"
					>
						<image :src="wx" mode="widthFix"></image>
						<span>微信上传</span>
					</view>
					<view class="popup_box_list"
					 @click="handlechoose('local')"
					>
						<image :src="local" mode="widthFix"></image>
						<span>本地上传</span>
					</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import wx from '@/static/images/components/wx.png'
	import local from '@/static/images/components/local.png'
	export default{
		name:'popupChoose',
		props: {
			moveShow: {
				type: Boolean,
				default: false
			}
		},
		
		data(){
			return{
				wx,
				local
			}
		},
		methods:{
			handlechoose(e){
				this.$emit('update:moveShow', false)
				this.$emit("handlechoose", e);
			}
		}
		// watch:{
		// 	moveShow(val){
		// 		console.log(val)
		// 	}
		// },
	}
</script>

<style lang="scss" scoped>
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