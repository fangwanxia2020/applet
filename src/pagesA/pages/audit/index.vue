<template>
	<view class="content">
		<u-search placeholder="请输入任务名称" bg-color='#ffffff' @custom='search' v-model='obj.query.name' @search='search'>
		</u-search>
		<view class="search">
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select :clear="false" :value="urgency" :localdata="urgenct" placeholder='紧急程度' @change="change1">
				</uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select :clear="false" :value="obj.query.tackTypeId" :localdata="typeRange" placeholder='任务类型'
					@change="change2"></uni-data-select>
			</view>
		</view>
		<view style='margin-bottom: 100rpx;'>
			<audit-list :taskObj='item' @changeEnable='changeEnable' :type="40" v-for="(item,index) in taskArry"
				:key='index'></audit-list>
			<u-loadmore :status="status" />
		</view>

	</view>
</template>

<script>
	import inputBox from "@/components/input-box/input-box.vue"
	import selectBox from "@/components/select-box/select-box.vue"
	import auditList from "@/components/audit-list/audit-list.vue"
	import {
		getauditList,
		getTaskType
	} from "@/api/pagesA/audit.js"

	export default {
		components: {
			inputBox,
			selectBox,
			auditList
		},
		data() {
			return {
				urgency: '',
				status: 'loadmore',
				// 任务类型
				typeRange: [{
					value: '',
					text: "任务类型"
				}, ],
				// 执行人员
				propleRang: [],
				// 紧急程度
				urgenct: [{
						value: '',
						text: '紧急程度'
					},
					{
						value: '0',
						text: '特急'
					},
					{
						value: '1',
						text: '加急'
					},
					{
						value: '2',
						text: '普通'
					},
				],

				// 周期任务列表
				taskArry: [],


				obj: {
					"pageNum": 1,
					"pageSize": 10,
					"query": {
						status: 40,
						name: '',
						tackTypeId: '',

					}
				},
				total: 0,
				listTotal: 0
			}
		},
		onShow() {
			this.getTypeRang()
			this.getTaskList()
		},
		onReachBottom() {
			console.log("this.listTotal456", this.listTotal.length)
			if (this.total == this.listTotal) {
				this.status = 'nomore';
				return
			}
			this.status = 'loading';
			this.obj.pageNum = ++this.obj.pageNum;
			this.getTaskList()
		},
		methods: {

			changeEnable() {
				this.getTaskList()
			},
			async getTaskList() {
				const res = await getauditList(this.obj)

				if (this.status == 'loading') {
					this.taskArry = [...this.taskArry, ...res.data.list]
				} else {
					this.taskArry = res.data.list
				}

				if (this.total == this.listTotal) {
					this.status = 'nomore';

				}
				this.listTotal = this.taskArry.length
				console.log("this.listTotal", this.listTotal)
				this.total = res.data.pagination.total
				console.log("res", res)
				for (let item of this.taskArry) {
					['30','50','60'].includes(item.status) ? item.statusClass = 'red' : item.statusClass = 'blue'
					item.statusName = ['草稿',`剩余${item.comingToEndDateTime}`,`已逾期${item.comingToEndDateTime}`,'待审核','已完成','已作废'][Number(item.status)/10 - 1]
					for (let i of this.typeRange) {
						if (item.tackTypeId == i.value) {
							this.$set(item, 'taskTypeName', i.text)
							console.log("item", item)
						}
					}
					for (let i of this.urgenct) {
						if (item.urgency == i.value) {
							this.$set(item, 'urgencyName', i.text)
							console.log("item", item)
						}
					}

				}

				console.log("this.taskArry", this.taskArry)
			},

			async getTypeRang() {
				const res = await getTaskType({})
				res.data.map(i => {
					i.text = i.name
					i.value = i.id
				})
				this.typeRange = [...this.typeRange, ...res.data]

				console.log("this.typeRange", this.typeRange)

			},
			search() {
				this.getTaskList()
			},

			change2(val) {
				console.log("val", val)
				this.obj.query.tackTypeId = val
				this.getTaskList()
			},
			change1(val) {
				console.log("val", val)

				if (val == '') {
					delete this.obj.query.urgencyList
				} else {
					this.obj.query.urgencyList = []
					this.obj.query.urgencyList[0] = val
				}


				this.getTaskList()
			}

		}
	}
</script>

<style lang="scss" scoped>
	// .search{
	// 	margin-bottom: 16rpx;
	// 	display: flex;
	// 	width: 100%;
	// 	justify-content:space-around;
	// 	padding:  0  16rpx;
	// 	box-sizing: border-box;
	// 	select{
	// 		width: 300rpx;
	// 		height: 70rpx;
	// 		border-radius: 35rpx;
	// 		padding: 16rpx;
	// 	}
	// }

	::v-deep .search {
		display: flex;
		width: 100%;
		justify-content: space-around;
		padding: 0 16rpx;
		box-sizing: border-box;

		.search-box {
			width: 33.3%;
			// margin: 0 20rpx;
		}

		.uni-select {
			border: none;
			border-bottom: none;

		}
	}

	::v-deep .u-button {
		margin: auto !important;
		width: 200rpx !important;
		height: 70rpx !important;


	}

	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.uni-pb-5 {
		padding-bottom: 10px;
	}
</style>
