<template>
	<view class="audit-detail">
		<custom-tabs type="c1" :value="value" @change="changeIndex" class="top-tab">

			<custom-tab-pane label="任务信息" name="c1_1">

				<view class="list-content">
					<view class="list-content-title">
						{{tastObj.name}}
					</view>
					<view class="list-content-cont">
						{{tastObj.taskContent}}
					</view>
				</view>

				<custom-tabs type="c2" @change="changeIndex" class="c2">
					<custom-tab-pane label="基础信息" name="c2_1">
						<view class="c2_1_content">
							<view>
								<view class="left c2-text">任务状态:</view>
								<view class="left">{{formatTackType(tastObj.status)||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">任务类型:</view>
								<view class="left">{{tastObj.tackTypeName||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">截止日期:</view>
								<view class="left">{{tastObj.deadlineTime.slice(0,16)||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">创建人:</view>
								<view class="left">{{tastObj.createName||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">负责人:</view>
								<view class="left">{{tastObj.personName||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">审核人:</view>
								<view class="left">{{tastObj.veriftPen||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">紧急程度:</view>
								<view class="left">{{formatUrgency(tastObj.urgency)||'无'}}</view>
							</view>
							<view>
								<view class="left c2-text">任务进度:</view>
								<view class="left">
									<view class="progress-box">
										<progress :percent="tastObj.taskProgress" show-info stroke-width="6" />
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
				<view class="list-adjunct" v-if="supportingInformation.context || zzfileList.length ">
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
						<view>{{item.context}}</view>
					</view>


				</view>
			</custom-tab-pane>

		</custom-tabs>

		<u-popup :show='show' mode="bottom" closeable='true' @close='closePopup'>
			<view class="u-popup-slot" style="height:50rpx;text-align: center;padding-top: 20rpx;">
				<view customStyle="height:50rpx;text-align:center;padding-top:20rpx">考核完成质量</view>

			</view>
			<view class="u-popup-slot"
				style="text-align:left;padding-top: 40rpx;  padding-left:20rpx; margin-bottom: 40rpx; "
				@click="goDetail">

				<view class="u-popup-slot" style="height:60rpx;text-align:left;color:blue;">系统评分</view>
				<view class="u-popup-slot"
					style="height:60rpx;width:calc(100% - 20rpx);text-align:left;border-bottom:1px solid #F5F5F5;padding-bottom:40rpx;overflow:hidden;">
					<text class="left" allow-half  :touchable="true" style="height:60rpx;line-height: 60rpx;">完成速度:</text>
					<uni-rate class="left" :readonly="true"  v-model="commitform.completeSpeed" :size="30" max='5'
						style="height:60rpx;line-height: 60rpx; margin-left: 20rpx;" />
				</view>
				<view class="u-popup-slot" style="height:60rpx;text-align:left;color:blue;">审核人评分</view>
				<view style="height:60rpx;width:100%;text-align:left;overflow:hidden;">
					<text class="left" style="height:60rpx;line-height: 60rpx;">完成质量:</text>
					<uni-rate class="left" allow-half  :touchable="true" v-model="commitform.score" :size="30" max='5'
						style="height:60rpx;line-height: 60rpx; margin-left: 20rpx;" />
				</view>
				<view class="u-popup-slot"
					style="text-align:left;padding-bottom:40rpx; overflow: hidden; position: relative;">
					<text class="left" style="height:80rpx;line-height: 80rpx;">评审意见:</text>
					<textarea @input='submit1' maxlength='255' v-model="commitform.context" placeholder='任务内容(选填)'
						style="float: left; border: 1px solid #F5F5F5 ; width: 560rpx; margin-left: 20rpx; margin-top: 20rpx;" />
						 <view class="num"><text style="color: #FB231F;">{{remnant1}}</text>/255</view>
				</view>
				
			</view>
			<view class='pop-next'>
				<u-button text='取消' @click="showBtn"></u-button>
				<u-button type="primary" text="确定" @click='commit'></u-button>
			</view>
		</u-popup>
		
		<u-popup :show="rejectOpen"  mode="bottom"  closeable='true' @close='rejectBtn' >
			<view class="u-popup-slot" style="height:50rpx;text-align: center;padding-top: 20rpx;  ">
				<view customStyle="height:50rpx;text-align:center;padding-top:20rpx">驳回意见</view>

			</view>
			<view class="u-popup-slot" style=" position: relative; overflow: hidden; text-align:left;padding-top: 50rpx;  padding-left:20rpx; margin-bottom: 40rpx; ">
				<text class="left" style="height:80rpx;line-height: 80rpx;">评审意见:</text>
				<textarea @input='submit2' v-model="commitform.context" placeholder='任务内容(选填)' 
					style="float: left; border: 1px solid #F5F5F5 ; width: 560rpx; margin-left: 20rpx; margin-top: 20rpx;" />
					<view class="num num2" ><text style="color: #FB231F;">{{remnant2}}</text>/255</view>
			</view>
			<view class="pop-next">
				<u-button class="u-popup-slot" style="width: 100rpx;" text='取消' @click="rejectBtn"></u-button>
				<u-button class="u-popup-slot" type="primary" text="确定" @click='rejectCommit'></u-button>
			</view>

		</u-popup>
		<u-toast ref="uToast" />
<view class="next-btn clearfix">
		
		<view class='next'>
			<button  @click='rejectBtn'>驳回</button>
			<button style="background-color: #026DFF;" type="primary" @click="showBtn">通过</button>
		</view>
</view>
	</view>
</template>

<script>
	import {
		getInfo,
		getRespCommitRec,
		commit,
		reject,
		fileInfo,
		getSupportingInformation ,
		getCompleteSpeed,
		taskLife
	} from "@/api/pagesA/audit.js"

	export default {
		data() {
			return {
				remnant1:0,
				remnant2:0,
				rejectOpen: false,
				show: false,
				value: 0,
				id: '',
				tastObj: {},
				fileLists: [],
				taskLifeList:[],
				historyList: [],
				taskInstanceId: '',
				zzfileList:[],
				supportingInformation:{},
				commitform: {
					context: '',
					completeSpeed: '',
					score: '',
					taskId: "",
					taskInstanceId: ""

				}


			}
		},
		onLoad(option) {
			console.log('option', option)
			this.id = option.id
			this.taskInstanceId = option.taskInstanceId
			this.commitform.taskId = option.id
			this.commitform.taskInstanceId = option.taskInstanceId
			this.getinfo(this.id)
			this.taskLife();
			this.getRespCommitRec();
			this.getSupporting(),
			this.getCompleteSpeed()
		},
		methods: {
			submit1(e){
				this.remnant1 = e.detail.value.length
			},
			submit2(e){
				this.remnant2 = e.detail.value.length
			},
		async	getCompleteSpeed(){
		const res = await getCompleteSpeed(this.taskInstanceId)
				          this.commitform.completeSpeed = res.data/2;
						
				     
			},
			rejectBtn(){
				this.rejectOpen = !this.rejectOpen
			},
			showBtn(){
				this.show = !this.show
			},
			async getSupporting() {
				console.log("getSupportingInformation",getSupportingInformation)
				const response = await getSupportingInformation({
					taskId: this.id,
					taskInstanceId: this.taskInstanceId
				})
			
				this.supportingInformation = response.data
				if (response.data.fileIdList != null && response.data.fileIdList.length != 0) {
					this.getzzFile(response.data.fileIdList)
				}
				console.log("this.zzfileList", this.zzfileList)
			},
			async getzzFile(fileIds) {
				this.zzfileList = []
				const info = await fileInfo(fileIds)
				this.zzfileList = info.data != null ? info.data : []
			},
			async commit() {
				let obj = {
					      taskId:this.commitform.taskId,
					          taskInstanceId:this.commitform.taskInstanceId,
					          completeSpeed:this.commitform.completeSpeed*2,
					          context:this.commitform.context,
					          score:this.commitform.score*2,
				}
				
				const res = await commit(obj)
				this.show = false
				this.$refs.uToast.show({
					title: '操作成功',
					type: 'success',
					url: '/pagesA/pages/audit/index',
				})
				uni.navigateBack({
					delta: 1
				});

			},
			//任务的一生
			taskLife(){
				let data = {
					id:this.taskInstanceId
				}
			
				taskLife(data).then(response => {
					this.taskLifeList= response.data
				});
			},
			async rejectCommit() {
				const res = await reject(this.commitform)
				this.rejectOpen = false
				this.$refs.uToast.show({
					title: '操作成功',
					type: 'success',
					url: '/pagesA/pages/audit/index',
				})
				uni.navigateBack({
					delta: 1
				});
			},
			closePopup() {
				this.show = false
			},
			async getRespCommitRec() {
				const res = await getRespCommitRec({
					taskId: this.id,
					taskInstanceId: this.taskInstanceId
				})

				this.historyList = [...this.historyList, ...res.data];
				console.log("this.historyList", this.historyList)
			},
			formatTackType(val) {
				if (val == 10) {
					return '草稿'
				} else if (val == 20) {
					return '进行中'
				} else if (val == 30) {
					return '预期'
				} else if (val == 40) {
					return '待审核'
				} else if (val == 50) {
					return '完成'
				} else if (val == 60) {
					return '作废'
				}
			},
			formatUrgency(val) {
				if (val == 0) {
					return '特急'
				} else if (val == 1) {
					return '加急'
				} else if (val == 2) {
					return '普通'
				}
			},
			changeIndex(e) {
				console.log('选中:', e)

			},
			async getinfo(id) {
				const res = await getInfo(id)
				this.tastObj = {
					...this.tastObj,
					...res.data
				}
				if(res.data.fileIds != null){
					await this.getFile(res.data.fileIds)
				}
			},
			async getFile(fileIds) {
				this.fileLists = []
				const info = await fileInfo(fileIds)
				this.fileLists = info.data != null ? info.data : []
			},
		}
	}
</script>
<style lang="scss" scoped>
	.audit-detail {
		margin-bottom: 100rpx;
	}

	::v-deep .progress-box {
		display: flex;
		height: 50rpx;
		margin-bottom: 60rpx;
		width: 400rpx;
	}

	::v-deep .content {
		width: calc(100% - 20rpx);
		overflow: hidden;
		padding-top: 0;
	}

	.content-item {
		width: calc(100% - 20rpx);
	}

	::v-deep .list-content {
		border-radius: 10rpx;
		width: calc(100% - 40rpx);
		background-color: #FFFFFF;
		padding: 20rpx;
		margin: auto;
		margin-bottom: 16rpx;
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
		// height: 60rpx;
		overflow: hidden;

		.c2-text {
			width: 150rpx;
			text-align: right;
			margin-right: 16rpx;
		}

	}

	.left {
		float: left;
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
	::v-deep .pop-next{
    margin: auto !important;
    display: flex;
    height: 120rpx;
    margin-top: 20rpx;
		.u-button{
			height: 70rpx !important;
			margin: 20rpx !important;
		}
	}
.next-btn{
	position: fixed !important;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	margin: auto !important;
	width: calc(100% - 40rpx) !important;
}
	.next {
		display: flex;	
		justify-content: space-between;
		padding: 0 119rpx;
		button{
			width: 220rpx;
			height: 76rpx ;
			line-height: 76rpx;
			font-size: 32rpx;
		}
	}
	
.clearfix:after{

    content:"";

    display:block;

    visibility:hidden;

    clear:both;

    }

	::v-deep .top-tab {
		.tab .tab-bar-item {
			width: 33% !important;
			padding: 0 !important;
		}
	}

	::v-deep .c2 {
		.tab {
			.tab-bar {
				width: calc(100% - 40rpx) !important;
				margin: auto;
				border-radius: 10rpx;

				.tab-bar-item {
					width: 24% !important;

				}
			}

		}

		.tab-cont {
			padding-top: 0 !important;
		}
	}
	
	    .num {
	         font-size: 28rpx;
	         color: #aaa;
	         width: 160rpx;
	         right: 40rpx;
	         position: absolute;
	         text-align: right;
	         bottom: 40rpx;
	    }
		.num2{
			 bottom: 0rpx;
		}
</style>
