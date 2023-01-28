<template>
	<view class="content">
		<u-search placeholder="请输入姓名" bg-color='#ffffff' @custom='search' v-model='formData.query.personName'
			@search='search' @clear='search'>
		</u-search>
		<view class="content_list">
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
			<view class="content_tab_list" v-for="(item,index) in info" :key="id">
				<view class="content_tab_list_top">
					<view class="content_tab_list_top_left">
						<text  :class="item.rank==1?'list_img_rank1':item.rank==2?'list_img_rank2':''">{{item.rank}}</text>
						{{item.personName}}
					</view>
					<view class="content_tab_list_top_rigth">
						<text>完成数：{{item.count}}</text>
						<text>平时耗时：{{item.timeConsuming}}</text>
					</view>
				</view>
				<view class="content_tab_list_btn">
					<view class="content_tab_list_btn_item">
						<text class="content_tab_list_btn_item_test">工作效率</text>
						<view class="content_tab_list_btn_item_progress">
							<u-line-progress :activeColor="'#026DFF'" :percentage="item.efficiency" :showText="false"></u-line-progress>
						</view>
						<view class="content_tab_list_btn_item_num">
							{{item.efficiency}}%
						</view>
					</view>
					<view class="content_tab_list_btn_item">
						<text class="content_tab_list_btn_item_test">工作质量</text>
						<view class="content_tab_list_btn_item_progress">
							<u-line-progress :activeColor="'#026DFF'" :percentage="item.quality" :showText="false"></u-line-progress>
						</view>
						<view class="content_tab_list_btn_item_num">
							{{item.quality}}%
						</view>
					</view>
					<view class="content_tab_list_btn_item">
						<text class="content_tab_list_btn_item_test">响应度</text>
						<view class="content_tab_list_btn_item_progress">
							<u-line-progress :activeColor="'#026DFF'" :percentage="item.responsivity" :showText="false"></u-line-progress>
						</view>
						<view class="content_tab_list_btn_item_num">
							{{item.responsivity}}%
						</view>
					</view>
				</view>
			</view>
		</view>
		
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
	import { sys_org,getTaskOverview  } from "@/api/pagesA/performance"
	export default {
		data() {
			return {
				startShow:false,
				startText:'',
				info:[],
				startColumns:[],
				formData: {
					pageNum: 1,
					pageSize: 10,
					query: {
						personName: '',
						orgIdList:[]
					}
				},
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init(){
				const res =  await sys_org()
				this.startColumns.push(res.data)
				this.startText = res.data[0].name
				this.formData.query.orgIdList[0] = res.data[0].id
				this.getTaskOverview()
			},
			async getTaskOverview(){
				const res = await getTaskOverview(this.formData)
				this.info = res.data.list
			},
			startConfirm(e){
				this.startText = e.value[0].name
				this.formData.query.orgIdList[0] = e.value[0].id
				this.startShow = false
				this.getTaskOverview()
			},
			search() {
				this.formData.pageNum = 1
				this.formData.pageSize = 10
				this.getTaskOverview()
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		&_list{
			position: relative;
			z-index: 20;
			background: #fff;
			font-size: 26rpx;
			color: #333333;
			border-radius: 10rpx;
			margin-top: 20rpx;
			&_item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 90rpx;
				margin: 0 40rpx;
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
			&_list{
				margin-top: 20rpx;
				border-radius: 10rpx;
				background: #fff;
				padding: 20rpx 0;
				&_top{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 0 20rpx;
					border-bottom: 1rpx solid #EEEEEE;
					height: 90rpx;
					color: #333333;
					font-size: 28rpx;
					&_left{
						text{
							width: 50rpx;
							height: 50rpx;
							display: inline-block;
							border-radius: 25rpx;
							background-color: #A3A3A3;
							color: #FFFFFF;
							text-align: center;
							line-height: 50rpx;
							margin-right: 10rpx;
							font-size: 24rpx
						}
					}
					&_rigth{
						color: #666666;
						font-size: 26rpx;
						text{
							margin-left: 20rpx;
						}
					}
				}
				&_btn{
					&_item{
						display: flex;
						align-items: center;
						margin-top: 30rpx;
						padding: 0 20rpx;
						box-sizing: border-box;
						&_test{
							color: #026DFF;
							display: inline-block;
							width: 130rpx;
						}
						&_progress{
							flex-grow:2;
						}
						&_num{
							width: 150rpx;
							color: #333333;
							padding-left: 10rpx;
							box-sizing: border-box;
						}
					}
				}
			}
		}
		.list_img_rank1 {
			width: 50rpx;
			height: 50rpx;
			border-radius: 25rpx;
			background-color: #F76260;
			color: #FFFFFF;
			text-align: center;
			line-height: 50rpx;
		}
		.list_img_rank2 {
			width: 50rpx;
			height: 50rpx;
			border-radius: 25rpx;
			background-color: rgba(254, 148, 0, 1);
			color: #FFFFFF;
			text-align: center;
			line-height: 50rpx;
		}
	}
</style>
