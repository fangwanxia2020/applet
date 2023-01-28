<template>
	<view class="audit-detail">
		<custom-tabs type="c1" :value="value" @change="changeIndex" class="top-tab">

			<custom-tab-pane label="任务信息" name="c1_1">

				<view class="list-content">
					<view class="list-content-title">
						{{tastObj.taskName}}
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
			<view v-for="(item,index ) in taskLifeList" :key='index'>
				<view>{{item}}</view>
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

	
		

		<u-toast ref="uToast" />
<view class="next-btn">
		<view class='next'>
			<view class="next-btn-left" @click="changeHeart()">
				<image style="width: 27rpx;height: 24rpx;"  :src="concern" mode="widthFix" v-if="!isActive"></image>
				<image style="width: 27rpx;height: 24rpx;"   :src="concern_hl" mode="widthFix" v-else></image>
			</view>
			<view class="next-btn-right" @click="handleUrge">
			<image style="width: 27rpx;height: 24rpx;"  v-show="!urge" :src="oversee" mode="widthFix"></image>
			<image style="width: 27rpx;height: 24rpx;" v-show="urge" :src="oversee_hl" mode="widthFix"></image>
			</view>
		</view>
	
</view>
	</view>
</template>

<script>
	import {
		getInfoP,
		getRespCommitRec,
		commit,
		reject,
		fileInfo,
		getSupportingInformation ,
		getCompleteSpeed,
		addAndCancel,
		urgeTask,
		taskLife
	} from "@/api/pagesA/period-task.js"
	
	import oversee from '@/static/images/pageA/oversee.png'
	import oversee_hl from '@/static/images/pageA/oversee_hl.png'
	import concern from '@/static/images/pageA/concern.png'
	import concern_hl from '@/static/images/pageA/concern_hl.png'

	export default {
		data() {
			return {
				taskLifeList:[],
				isActive:false,
				 urge: false,
				oversee,
				oversee_hl,
				concern,
				concern_hl,
				rejectOpen: false,
				show: false,
				value: 0,
				id: '',
				tastObj: {},
				fileLists: [],
				historyList: [],
				taskInstanceId:'',
				zzfileList:[],
				supportingInformation:{},
				taskPsnAttentionId:''
			}
		},
		onLoad(option) {
			console.log('option', option)
			this.id = option.id
		this.taskInstanceId = option.taskId
			
			this.getinfo(this.id)
			this.getRespCommitRec()
			this.getSupporting()
			this.taskLife()
		
		},
		methods: {
    async taskLife() {
		const response = await taskLife({taskId:this.taskInstanceId})
          this.taskLifeList = []
		  
     this.taskLifeList= [...this.taskLifeList,...response.data]
      },
			async getSupporting() {
				console.log("getSupportingInformation",getSupportingInformation)
				const response = await getSupportingInformation({
					taskId: this.taskInstanceId,
					taskInstanceId: this.id
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

			async getRespCommitRec() {
				const res = await getRespCommitRec({
					taskId: this.taskInstanceId,
					taskInstanceId: this.id
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
				const res = await getInfoP(id)
				 this.urge = res.data.isTaskPsnUrge
				 this.taskPsnAttentionId =res.data.taskPsnAttentionId
				 res.data.isTaskPsnAttention == 0 ? this.isActive = false : this.isActive = true
				this.tastObj = {
					...this.tastObj,
					...res.data
				}
				
				await this.getFile(res.data.fileIds)
			},
			async getFile(fileIds) {
				this.fileLists = []
				const info = await fileInfo(fileIds)
				this.fileLists = info.data != null ? info.data : []
			},
			// 关注
			      async changeHeart() {
			        let data = {}
			        // this.concern ? data.id = this.info.taskPsnAttentionId : data.taskId = this.info.id
			        this.isActive ? data.id = this.taskPsnAttentionId : data.taskId = this.id
			        const res = await addAndCancel(data)
			        if (res.msg == '操作成功') {
			          this.isActive = !this.isActive
			        }
			      },
				  
				     //督办
				        handleUrge() {
				          if (this.urge) return
				          let data = {taskInstanceId: this.id}
				          urgeTask(data).then(response => {
				            let urgeTask = response
				            console.error(urgeTask)
				            if (response.code == '200') {
				              this.urge = !this.urge
				              // this.messageSuccess('操作成功')
				            }
				          });
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
		height: 60rpx;
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
}
	::v-deep .next {
		justify-content: center;
	bottom: 20rpx;
			height: 70rpx;
			text-align: center;
		display: flex;

		.next-btn-left {
		    width: 70rpx !important;
		    height: 70rpx !important;
		    /* margin-right: 20rpx; */
		    border-radius: 70rpx;
		    background-color: #eae8e8;
		    line-height: 70rpx;
		    margin: 0 10rpx;

		}

		.next-btn-right {
		    width: 70rpx !important;
		    height: 70rpx !important;
		    /* margin-right: 20rpx; */
		    border-radius: 70rpx;
		    background-color: #eae8e8;
		    line-height: 70rpx;
		    margin: 0 10rpx;
		}
		image{
			width: 25rpx;
		}

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
