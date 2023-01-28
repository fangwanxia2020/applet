<template>
	<view>
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
								<view class="left">{{tastObj.deadlineTime||'无'}}</view>
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
						<view class="tips">
							<view class="tips-1">
								<view class="tips-2">
									<text>{{formatTackType(tastObj.status)||'无'}}</text>



								</view>
							</view>
						</view>
					</custom-tab-pane>
					<custom-tab-pane label="任务的一生" name="c2_2">
						<view class="c2_1_content">
							<view>
								<view class="left c2-text">由谁创建:</view>
								<view class="left">无</view>
							</view>
							<view>
								<view class="left c2-text">评审时间:</view>
								<view class="left">无</view>
							</view>
							<view>
								<view class="left c2-text">由谁作废:</view>
								<view class="left">无</view>
							</view>
							<view>
								<view class="left c2-text">最后修改:</view>
								<view class="left">无</view>
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

				<view class="list-adjunct">
					<view class="list-adjunct-text">
						<view class="list-adjunct-text-left">
							{{supportingInformation.context}}
						</view>
						<view class="list-adjunct-text-right">
							{{supportingInformation.updateTime}}更新
						</view>
					</view>
					<file-list :fileLists="zzfileList"></file-list>
				</view>
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
								<uni-rate class="left" v-model="item.completeSpeed" :size="18" max='10'
									style="height:60rpx;line-height: 60rpx; padding-top: 10rpx; margin-left: 20rpx;" />
							</view>
							<view class="split-line"></view>

							<view class="system-score">审核人评分</view>
							<view class="flex">
								<view class="speed">完成质量:</view>
								<uni-rate class="left" v-model="item.score" :size="18" max='10'
									style="height:60rpx;line-height: 60rpx; padding-top: 10rpx; margin-left: 20rpx;" />
							</view>
						</view>
					</view>


				</view>
			</custom-tab-pane>

		</custom-tabs>



		<u-toast ref="uToast" />

	</view>
</template>

<script>
	import {
		getInfo,
		getRespCommitRec,
		commit,
		reject,
		getSupportingInformation,
		fileInfo
	} from "@/api/pagesA/temporary.js"

	export default {
		data() {
			return {
				supportingInformation: {},
				rejectOpen: false,
				show: false,
				value: 0,
				id: '',
				tastObj: {},
				fileLists: [],
				zzfileList: [],
				historyList: [],
				taskInstanceId: '',
				commitform: {
					context: '',
					scope: '',
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
			this.getRespCommitRec();
			this.getSupporting();
		},
		methods: {
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
				console.log("this.commitform", this.commitform)
				const res = await commit(this.commitform)
				this.show = false
				this.$refs.uToast.show({
					title: '操作成功',
					type: 'success',
					url: '/pagesA/pages/audit/index',
				})

			},
			async rejectCommit() {
				const res = await reject(this.commitform)
				this.rejectOpen = false
				this.$refs.uToast.show({
					title: '操作成功',
					type: 'success',
					url: '/pagesA/pages/audit/index',
				})
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
				await this.getFile(res.data.fileIds)
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
	.split-line {
		width: 100%;
		border-bottom: 1px #AAAAAA dashed;
	}

	.history-content {
		width: calc(100% - 20rpx);
		margin: auto;
		background-color: #f9f4f4;
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

	::v-deep .progress-box {
		display: flex;
		height: 50rpx;
		margin-bottom: 60rpx;
		width: 400rpx;
	}

	.flex {
		display: flex;
		width: 100%;
	}

	.speed {

		font-size: 30rpx;
		padding-bottom: 30rpx;
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
			line-height: 25px;

			width: 100%;

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
			}

			.tab-bar-item {
				width: 24% !important;

			}
		}

		.tab-cont {
			padding-top: 0 !important;
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
		overflow: hidden;


		.creaTask-title {
			font-size: 32rpx;
			font-weight: 600;
			margin-bottom: 16rpx;
		}
	}

	.next {
		display: flex;
		justify-content: space-between;
		padding: 0 119rpx;

		.u-button {
			width: 160rpx;
			height: 60rpx;
			line-height: 76rpx;
			font-size: 32rpx;
			margin-top: 20rpx;
		}
	}

	.tips {
		width: 150rpx;
		// height: 150rpx;
		// border-radius: 150rpx;
		// border: 1px solid red;
		color: red;
		text-align: center;
		position: relative;
		top: -400rpx;
		left: 500rpx;
	}

	.tips-1 {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		border: 1px solid red;
		position: absolute;

	}

	.tips-2 {
		width: 120rpx;
		height: 120rpx;
		border-radius: 120rpx;
		border: 1px solid red;
		position: absolute;
		top: 15rpx;
		left: 15rpx;
		transform: rotate(-45deg);

		text {
			line-height: 120rpx;
		}
	}
</style>
