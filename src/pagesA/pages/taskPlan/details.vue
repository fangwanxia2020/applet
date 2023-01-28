<template>
    <view class="box">
			<custom-tabs type="c1" :value="value" @change="changeIndex"  class="top-tab">
				<custom-tab-pane label="任务信息" name="c1_1">
					<view class="list-content">
						<view class="list-content-title">
							{{info.name || info.taskName}}
						</view>
						<view class="list-content-cont">
							{{info.taskContent}}
						</view>
					</view>
					<custom-tabs type="c2"  @change="changeIndex">
						<custom-tab-pane label="任务信息" name="c2_1" class="c2">
							<view class="c2_1_content">
								<view class="">
									<view class="list-info-list">
										<span class="c2-text">任务状态：</span>
										<span>{{infoData.statusName}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">任务类型：</span>
										<span>{{infoData.tackTypeName}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">截止日期：</span>
										<span>{{infoData.deadlineTime?infoData.deadlineTime.substring(0, 16):''}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">创建人：</span>
										<span>{{infoData.createName}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">负责人：</span>
										<span>{{infoData.personName}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">审核人：</span>
										<span>{{infoData.veriftPen}}</span>
									</view>
									<view class="list-info-list">
										<span class="c2-text">紧急程度：</span>
										<span>{{infoData.urgencyName}}</span>
									</view>
									<view class="list-info-plan">
										<span class="c2-text">任务进度：</span>
										<view class="plan_strip">
											<u-line-progress activeColor="#026DFF" :percentage="infoData.taskProgress" :showText="false"></u-line-progress>
											<view class="plan_strip_percent">
												{{infoData.taskProgress||0}}%
											</view>
										</view>
									</view>
								</view>
							</view>
							
						</custom-tab-pane>
						<custom-tab-pane label="任务的一生" name="c2_2">
							<view class="c2_1_content">
								<view class="list-life">
									<view class="" v-for="(item,index) in taskLifeList" :key="index">
										{{item}}
									</view>
								</view>
							</view>
						</custom-tab-pane>
						
						<custom-tab-pane label="多人负责" name="c2_3"  v-if="tableDataList.length > 1">
							<view class="c2_1_content">
								<uni-table  ref="table" :stripe='false'  emptyText="暂无更多数据" >
									<uni-tr>
										<uni-th width="100" align="left" class="table-count-1">负责人</uni-th>
										<uni-th width="100" align="left" class="table-count-2">阶段</uni-th>
										<uni-th width="100" align="left" class="table-count">任务进度</uni-th>
										<uni-th width="80" align="left" class="table-count">详情</uni-th>
									</uni-tr>
									<uni-tr v-for="(item, index) in tableDataList" :key="index">
										<uni-td class="table-count-1">
											<view class="name">{{ item.personName }}</view>
										</uni-td>
										<uni-td class="table-count-2">
											<view class="name">{{ item.statusName }}</view>
										</uni-td>
										<uni-td class="table-count">
											<view class="name">
												<view style="width: 60rpx; height:60rpx;">
													 <arprogress 
													 width='80' 
													 borderWidth="12"
													 :percent="item.taskProgress"
													 >
														<text style="font-size: 24rpx;transform: scale(0.8); white-space:nowrap;">{{item.taskProgress || 0}}%</text>
													 </arprogress>
												</view>
											</view>
										</uni-td>
										<uni-td class="table-count">
											<view class="name" style="color: #026DFF;" @click="next('/pagesA/pages/havePublished/details?id='+item.id+'&sonType=1&viewType=1')" >查看</view>
										</uni-td>
									</uni-tr>
								</uni-table>
							</view>
						</custom-tab-pane>
						
					</custom-tabs>
					<view class="list-adjunct">
						<view class="list-adjunct-text">
							<view class="list-adjunct-text-left">
								附件
							</view>
							<view class="list-adjunct-text-right">
								附件{{fileLists.length}}个
							</view>
						</view>
						<file-list :fileLists="fileLists"></file-list>
					</view>
				</custom-tab-pane>
				<custom-tab-pane label="佐证资料" name="c1_2">
					<view class="list-adjunct" v-if="supportingInformation.context || zzfileList.length">
						<view class="list-adjunct-text">
							<view class="list-adjunct-text-left">
								{{supportingInformation.context}}
							</view>
							<view class="list-adjunct-text-right">
								{{supportingInformation.updateTime.substring(0, 16)}}更新
							</view>
						</view>
						<file-list :fileLists="zzfileList"></file-list>
					</view>
					<u-empty
						v-else
						key="taskEmpty"
						margin-top="100rpx"
						text="暂未上传资料"
					>
					</u-empty>
				</custom-tab-pane>
				<custom-tab-pane label="历史记录" name="c1_3">
					<view class="creaTask-base">
						<view class="creaTask-title">历史记录 </view>
						<view v-for="(item,index) in historyList " :key="index">
							<view v-if="item.commit!=9&&item.commit!=10">{{item.context}}</view>
							<view class="history-content" v-if="item.commit==9">
								<view class="yijian">评审意见：{{item.context}}</view>
								<view class="system-score">系统评分</view>
								<view class="flex">
									<view class="speed">完成速度:</view>
										<uni-rate class="left" :readonly="true"  v-model="item.completeSpeed/2" :size="30" max='5'
											style="height:60rpx;line-height: 60rpx; margin-left: 20rpx;" />
								</view>
								<view class="split-line"></view>
								<view class="system-score">审核人评分</view>
								<view class="flex">
									<view class="speed">完成质量:</view>
										<uni-rate class="left" :readonly="true"  v-model="item.score/2" :size="30" max='5'
											style="height:60rpx;line-height: 60rpx; margin-left: 20rpx;" />
								</view>
							</view>
						</view>
					</view>
				</custom-tab-pane>
		</custom-tabs>
		
		
	
		
    </view>
</template>

<script>
	import {respTaskDetails,respTaskInstance,getInfoTask,taskLife,getSupportingInformation,fileInfo,urgeTask} from "@/api/pagesA/havePublished"
	import {addAndCancel} from "@/api/pages/jobJacket"
	import {getRespCommitRec} from "@/api/pagesA/audit.js"
	import file from '@/static/images/pageA/file.png'
	import fileList from "@/components/file-list/file-list.vue"
	import arprogress from '@/components/ar-circle-progress/index.vue'
	export default {
		data() {
				return {
					file,
					value: 0,
					info:{},
					historyList:[],
					tableData:[],
					taskLifeList:[],
					fileLists:[],
					zzfileList:[],
					sonType:0,
					viewType:'',
					urge:false,
					supportingInformation:{}
				}
		},
		components: {
			fileList,
			arprogress
		},
		computed:{
			infoData(){
				this.info.urgencyName = ['特急','加急','普通'][this.info.urgency]
				this.info.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(this.info.status)/10 - 1]
				return this.info
			},
			tableDataList(){
				return this.tableData.filter(item =>{
					return item.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(item.status)/10 - 1]
				})
			}
		},
		async onLoad(options) {
			const {id,sonType,viewType} = options
			let info 
			sonType ? info = await respTaskDetails(id) : info = await getInfoTask(id)
			
			this.viewType = viewType
			if(info.data.fileIds != null) {
				const fileRes = await fileInfo(info.data.fileIds)
				this.fileLists = fileRes.data || []
			}
			this.info = info.data
			this.id = id
			this.sonType = sonType
			const data = {
          pageNum: 1,
          pageSize: 10,
          query: {taskId:id}
			}
			const res = await respTaskInstance(data)
			this.tableData = res.data.list || []
			this.getRespCommitRec()
			this.taskLife()
			this.getSupportingInformation()
		},
		onShow() {
			this.value2 = 0
		},
		onHide() {
		},
		methods: {
			//历史记录
			async getRespCommitRec() {
				const res = await getRespCommitRec({
					[this.sonType?'taskInstanceId':'taskId']: this.id,
				})
				this.historyList = [...this.historyList, ...res.data];
			},
			//任务的一生
			taskLife(){
				let data = {}
				this.sonType == 1? data.id = this.info.id : data.taskId = this.info.id
				taskLife(data).then(response => {
					this.taskLifeList= response.data
				});
			},
		
			
			getSupportingInformation(){
				let data = { [this.sonType?'taskInstanceId':'taskId']:this.id }
				getSupportingInformation(data).then(response => {
					this.supportingInformation = response.data
					if(response.data.fileIdList != null && response.data.fileIdList.length != 0){
						this.getFile(response.data.fileIdList)
					}
				});
			},
			async getFile(fileIds) {
				const info = await fileInfo(fileIds)
				this.zzfileList = info.data || []
			},
			next(url){
				uni.redirectTo({url})
			},
			changeIndex(e) {
					console.log('选中:', e)
			}
		}
	}

</script>
<style lang="scss" scoped>
	.split-line {
		width: 100%;
		border-bottom: 1px #AAAAAA dashed;
	}
	.history-content {
		width: calc(100% - 20rpx);
		margin: auto;
		background-color: rgb(242, 242, 242);
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		.yijian {
			padding-bottom: 10rpx;
			border-bottom: 1rpx #AAAAAA dashed;
		}
	}
	.system-score {
		color: #026DFF;
		padding: 10rpx 0;
		font-weight: 600;
		font-size: 30rpx;
	}
	.flex {
		display: flex;
		width: 100%;
	}
	.speed {
		font-size: 30rpx;
		padding-bottom: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
::v-deep .top-tab{
	.tab .tab-bar-item{
		width: 33.3% !important;
		padding: 0 !important;
	}
}
::v-deep .c2 {
	.tab{
		.tab-bar{
			width: calc(100% - 40rpx) !important;
			margin: auto;
			border-radius: 10rpx;
		}
		.tab-bar-item{
			width: 24% !important;
		}
	}
	.tab-cont {
		padding-top: 0 !important;
	}
}

	.c2_1_content {
		height: 500rpx;
		background-color: #FFFFFF;
		width: calc(100% - 40rpx);
		margin: auto;
		padding-top: 20rpx;
		border-radius: 10rpx;
	}

	.c2_1_content>view {
		background-color: #FFFFFF;
		width: calc(100% - 40rpx);
		margin: auto;
		min-height: 460rpx;
		overflow: hidden;
		padding: 20rpx;
		.c2-text {
			width: 150rpx;
			text-align: right;
			margin-right: 16rpx;
			display: inline-block;
		}
	}

	.left {
		float: left;
	}
.box{
	padding-bottom: 90rpx;
}
.img-handel{
	position: fixed;
	bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}
::v-deep .list-content {
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 20rpx;
		margin: 0 20rpx 16rpx;
		box-sizing: border-box;
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
			min-height: 50rpx;
			width: 100%;
			color: #6b6b6b;
			font-size: 30rpx;
		}
		.list-content-time{
			line-height: 50rpx;
			height: 50rpx;
			font-size: 24rpx;
			color: #4a4a4a;
		}
	}
	::v-deep .creaTask-base {
		background-color: #FFFFFF;
		box-sizing: border-box;
		padding: 16rpx;
		width: calc(100% - 40rpx);
		margin: auto;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	
	
		.creaTask-title {
			font-size: 32rpx;
			font-weight: 600;
			margin-bottom: 16rpx;
		}
	}


	.list-info-list{
		span{
			color: #000;
		}
	}
	.list-info-plan{
		display: flex;
		.plan_text{
			width: 142rpx;
		}
		.plan_strip{
			color: #026DFF;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 60%;
			.plan_strip_percent{
				margin-left: 20rpx;
				font-size: 24rpx;
				width: 72rpx;
			}
		}
	}
	.list-adjunct-box{
		background-color: #fff;
	}
	.list-adjunct{
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 20rpx;
		margin: 0 20rpx 16rpx;
		box-sizing: border-box;
		.list-adjunct-text{
			height: 81rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #EEEEEE;
			margin-bottom: 40rpx;
			.list-adjunct-text-left{
				font-size: 32rpx;
				font-weight: bold;
				color: #026DFF;
			}
			.list-adjunct-text-right{
				font-size: 24rpx;
				color: #666666;
			}
		}
		.list-adjunct-state{
			margin: 0 10rpx;
			font-size: 26rpx;
			background-color: #F8F8F8;
			color: #666666;
			margin-bottom: 30rpx;
		}
		.list-adjunct-list{
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			.list-adjunct-list-one{
				margin-right: 34rpx;
			}
			.list-adjunct-list-two{
				.size{
					margin-right: 30rpx;
				}
				.preview{
					color: #026DFF;
					margin-right: 20rpx;
				}
				.down{
					color: #026DFF;
					
				}
			}
		}
		image{
			width: 22rpx;
			margin-right: 20rpx;
		}
	}
	
</style>
