<template>
	<view class="issue content">
		<u-input style="margin-bottom: 20rpx;" v-model='dataTime' placeholder="请选择下发日期" disabled disabledColor='#ffffff'
			type='textarea' :auto-height='true' @click.native='show = true' />
		<u-calendar :show="show" mode="range" @confirm="confirm" @close='show=false'></u-calendar>
		<view class='table-box'>
			<view class="creaTask-title">下发日期</view>
			<uni-table ref="table" stripe='false' border emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center" >下发次数</uni-th>
					<uni-th align="center" >下发日期</uni-th>
					<uni-th align="center" >截止日期</uni-th>

				</uni-tr>
				<uni-tr v-for="(item, index) in listTableData" :key="index" @click.native="pickData(item.id)">

					<uni-td align="center" >
						<view class="name" :class="item.active?'active':''">{{ item.periodicTaskNum }}</view>
					</uni-td>
					<uni-td align="center" >
						<view :class="item.active?'active':''">
							{{ item.createTime.slice(0,16) }}
						</view>
					</uni-td>
					<uni-td align="center" >
						<view :class="item.active?'active':''">
							{{ item.deadlineTime.slice(0,16) }}
						</view>
					</uni-td>

				</uni-tr>


			</uni-table>
		</view>
		<view class='table-box'>
			<view class="creaTask-title">负责人情况</view>
			<uni-table ref="table" stripe='false'  border  emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">负责人</uni-th>
					<uni-th align="center">阶段</uni-th>
					<uni-th align="center">任务进度</uni-th>
					<uni-th align="center">详情</uni-th>


				</uni-tr>
				<uni-tr v-for="(item, index) in detailTableData" :key="index">

					<uni-td align="center">
						<view>{{ item.personName }}</view>
					</uni-td>
					<uni-td align="center">
						<view>{{ item.statusName }}</view>
					</uni-td>
					<uni-td align="center">
							<view style="width: 100rpx; height:100rpx; overflow: hidden;margin: auto;">
										  <arprogress width='100' :percent="item.taskProgress"><text>{{item.taskProgress || 0}}%</text></arprogress>
									</view>
							
					</uni-td>
					<uni-td align="center">
						<view class="name" style="color: #007AFF;" @click="goDetail(item)">查看</view>
					</uni-td>
				</uni-tr>

			</uni-table>
		</view>
	</view>
</template>
<script>
	import inputBox from "@/components/input-box/input-box.vue"
	import arprogress from '@/components/ar-circle-progress/index.vue'
	import {
		respTaskInstance,
		respTask
	} from "@/api/pagesA/period-task.js"
	export default {
		components: {
			inputBox,
			arprogress
		},
		data() {
			return {
				dataTime: '',
				show: false,
				id: '',
				listTableData: [],
				detailTableData: [],
				form: {
					pageNum: 1,
					pageSize: 10,
					query: {
						isPeriodicTask: 1,
						periodicTaskId: "",
						beginTime: null,
						endTime: null
					}
				}

			}
		},
		async onLoad(option) {
			console.log("option", option)
			this.id = option.id
			this.form.query.periodicTaskId = option.id
			await this.getList()
			if (this.listTableData.length > 0) {
				this.$set(this.listTableData[0], 'active', true)
				this.getlistDetail(this.listTableData[0].id)
			}
		},
		methods: {
			async getlistDetail(id) {
				let obj = {
					pageNum: 1,
					pageSize: 10,
					query: {
						taskId: id
					}

				}
				const res = await respTaskInstance(obj)
				console.log('res111',res)
				this.detailTableData = []
				this.detailTableData = [...this.detailTableData, ...res.data.list]
				this.detailTableData.filter(item => {
					item.statusName = ['草稿', '进行中', '逾期', '待审核', '完成', '作废'][Number(item.status) / 10 - 1]
				})
				
				console.log("this.detailTableData",this.detailTableData)
			},
			async getList() {
				const res = await respTask(this.form)
				this.listTableData = [...this.listTableData, ...res.data.list]
				this.listTableData.filter(item => {
					this.$set(item, 'active', false)
				})
				console.log("this.listTableData", this.listTableData)


			},
			pickData(id) {
				console.log("1111")
				this.listTableData.filter(item => {

					this.$set(item, 'active', false)
					if (item.id == id) {
						this.$set(item, 'active', true)
					}
				})
				this.getlistDetail(id)
			},
			confirm(e) {
				console.log(e)

				this.dataTime = e[0] + '  到  ' + e[e.length - 1]
				this.form.query.beginTime = e[0] + ' 00:00:00'
				this.form.query.endTime = e[e.length - 1] + ' 23:59:59'
				this.getList()
				this.show = false

			},
			goDetail(item) {
				console.log("item", item)
				uni.navigateTo({
					url: `/pagesA/pages/periodTask/detail?id=${item.id}&taskId=${item.taskId}`

				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.issue {

		box-sizing: border-box;
		width: 100%;
		padding: 16rpx;
	}

	::v-deep .table-box {
		background-color: #FFFFFF;
		padding: 16rpx;
		border-radius: 6rpx;
		margin-bottom: 20rpx;
		font-size: 24rpx;
	}



	.creaTask-title {
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 16rpx;
	}

	::v-deep .active {
		color: #007AFF;

	}

	::v-deep .uni-table-tr {

		.uni-table-td {
			padding: 0 !important;
			view {
				font-size: 24rpx !important;
				line-height: 100rpx !important;
			}
		}
	}
</style>
