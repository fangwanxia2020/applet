<template>
	<view class="centent">
		<view class="list-box" v-for="(item,index) in adapterData" :key="item.id">
			<view class="list-btn clearfix">
				<view class="left">
					<span>{{item.personIds.length>1 ? '多人':'单人'}}</span>
					<span>{{item.tackTypeName}}</span>
					<span class="sign">{{['特急','加急','普通'][item.urgency]}}</span>
				</view>
			<view class="right" @click="handerOpen(index)" v-if="item.status == 20 || item.status == 30">
				<u-icon
						name="more-dot-fill"
						size="18"
				></u-icon>
			</view>
			</view>
			<view class="list-content" >
				<view  @click="next(`/pages/jobJacket/detail?id=${item.id}&viewType=${item.personIds.length>1?0:1}`)">
					<view class="list-content-title">
						{{item.name}}
					</view>
					<view class="list-content-cont">
						{{item.taskContent}}
					</view>
					<view class="list-content-time">
						截止: {{item.deadlineTime.substring(0, 16)}} 
						<text class="list-content-status" :class="item.statusClass">{{item.statusName}}</text>
					</view>
				</view>
				<view class="list-content-progress">
					<u-line-progress activeColor="#026DFF" :percentage="item.taskProgress" :showText="false"></u-line-progress>
					<view class="list-content-progress-percent">
						{{item.taskProgress || 0}}%
					</view>
					
					<view class="list-content-progress-handel">
						<view class="" v-if="item.personIds.length<2"  @click="handleUrge(item.id,item.isUrge,index)">
							<image style="height: 28rpx;" :src="remind"  v-if="item.isUrge == 0" mode="widthFix"></image>
							<image style="height: 28rpx;" :src="remind_hl" v-else mode="widthFix"></image>
						</view>
						<view class=""  @click="handleConcern(item.id,item.taskPsnAttentionId,index)">
							<image style="width: 27rpx;height: 24rpx;"  v-if="item.isTaskPsnAttention == 0" :src="concern" mode="widthFix"></image>
							<image style="width: 27rpx;height: 24rpx;"  v-else :src="concern_hl" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-popup closeable v-if="listData.length >0" :show="show" mode="bottom"  @close="show = false">
			<view class="popup_box">
					<view class="popup_box_text">
						{{listData[index].name}}
					</view>
					<view class="popup_box_list" 
					@click="handleObsolete(index)"
					>
						<image :src="remove" mode="widthFix"></image>
						<span>作废任务</span>
					</view>
					<!-- <view class="popup_box_list"
					v-if="listData[index].secondaryTaskList" 
					@click="handleSubtask(index)"
					>
						<image :src="subtask" mode="widthFix"></image>
						<span>查看子任务</span>
					</view> -->
			</view>
			</u-popup>
		
		<u-modal :show="modalShow"
		@close="modalShow = false" 
		@cancel="modalShow = false" 
		@confirm="hendleCommit(listData[index].id)"
		:closeOnClickOverlay="true" 
		:showCancelButton="true" 	
		:title="'提示'" 
		:content="'是否作废该任务'"
		></u-modal>
		<button @click="next('/pages/jobJacket/resolveTask?id='+id)">分解任务</button>
	</view>
</template>

<script>
	import concern from '@/static/images/pageA/concern.png'
	import concern_hl from '@/static/images/pageA/concern_hl.png'
	import remind from '@/static/images/pageA/oversee.png'
	import remind_hl from '@/static/images/pageA/oversee_hl.png'
	import remove from '@/static/images/pageA/remove.png'
	import {cancelTaskType,addAndCancel} from "@/api/pages/jobJacket"
	import {respTaskList,urgeTask} from "@/api/pagesA/havePublished"
	export default{
		data(){
			return{
				concern,
				concern_hl,
				remind,
				remind_hl,
				remove,
				listData:[],
				id:'',
				title:'提示',
				content:'是否提交审批',
				show:false,
				modalShow:false,
				index:0,
				fromData:{
					pageNum: 1,
					currPage: 1,
					pageSize: 10,
					isPeriodicTask: 1,
					query: {
						isPeriodicTask: 1,
						parentId:''
					}
				}
			}
		},
		computed:{
			adapterData(){
				return this.listData.filter(item =>{
					[30,50,60].includes(item.status) ? item.statusClass = 'red' : item.statusClass = 'blue'
					item.statusName = ['草稿',`剩余${item.comingToEndDateTime}`,`已逾期${item.comingToEndDateTime}`,'待审核','已完成','已关闭'][Number(item.status)/10 - 1]
					return item
				})
			},
		},
		onLoad(options) {
			const {id} = options
			this.fromData.query.parentId = id
		},
		onShow() {
			this.init()
		},
		methods:{
			//子任务
			init() {
				respTaskList(this.fromData).then(response => {
					this.listData = response.data.list
				});
			},
			//关注
			async handleConcern(id,taskPsnAttentionId,index){
				let data = {}
				this.listData[index].isTaskPsnAttention ? data.id = taskPsnAttentionId : data.taskId = id
				const res = await addAndCancel(data)
				if(res.msg == '操作成功'){
					//未关注不存在taskPsnAttentionId值，所以关注的时候需要把taskPsnAttentionId赋值上去
					if(!this.listData[index].isTaskPsnAttention){
						const fromData={
							pageNum: Math.ceil((index+1)/10),
							pageSize: 10,
							query:this.fromData.query
						}
						const resTask = await respTaskList(fromData)
						const currentIndex = index+10 - Math.ceil((index+1)/10)*10
						this.listData[index].taskPsnAttentionId = resTask.data.list[currentIndex].taskPsnAttentionId
					}
					this.$set(this.listData[index],'isTaskPsnAttention',!this.listData[index].isTaskPsnAttention)
				}
			},
			//督办
			async handleUrge(id,isUrge,index){
				if(isUrge) return
				const data = {taskId:id}
				const res = await urgeTask(data)
				if(res.msg == '操作成功'){
					this.$set(this.listData[index],'isUrge',!this.listData[index].isUrge)
				}
			},
			handerOpen(index){
				this.show = true
				this.index = index
			},
			//作废
			handleObsolete(index){
				this.show = false
				this.modalShow = true
				this.index = index
				// return 
				
			},
			async hendleCommit(id){
				const res = await cancelTaskType(id)
				this.modalShow = false
				uni.$u.toast(res.msg)
				if(res.msg == '操作成功') this.$set(this.listData[this.index],'status',60)
			},
			next(url){
				console.log(url)
				uni.navigateTo({url})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
		
	.centent{
		overflow: hidden;
	}
	button{
		background-color: #026DFF;
		color: #FFFFFF;
		position: fixed;
		bottom: 40rpx;
		text-align: center;
		width: 200rpx;
		height: 70rpx;
		font-size: 28rpx;
		line-height: 76rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.list-box {
		border-radius: 10rpx;
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx;
		margin-top: 16rpx;
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
		.list-content-cont{
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
		.list-content-time{
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
		.list-content-progress{
			display: flex;
			align-items: center;
			.list-content-progress-percent{
				font-size: 24rpx;
				color:#026DFF;
				margin-left: 27rpx;
			}
			.list-content-progress-handel{
				width: 120rpx;
				text-align: right;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view{
					width: 50%;
				}
				image:nth-of-type(2){
					width: 27rpx;
					margin-left: 42rpx;
				}
			}
			
			image{
				width: 30rpx;
			}
		}
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