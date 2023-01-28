<template>
	<view class="content">
		<!-- <u-search placeholder="请输入任务名称" v-model='query.name' @search='search' ></u-search> -->
		<u-search placeholder="请输入任务名称" bg-color='#ffffff' @custom='search' v-model='obj.query.name' @search='search'>
		</u-search>
		<view class="search">
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select :value="obj.query.selectPersonType" placeholder='执行人员' :localdata="propleRang"
					@change="change1" :clear="false"></uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select  :clear="false" :value="obj.query.urgency" :localdata="urgenct" placeholder='紧急程度' @change="change2">
				</uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select :clear="false" :value="obj.query.tackTypeId" :localdata="typeRange" placeholder='任务类型'
					@change="change3"></uni-data-select>
			</view>
		</view>
		<view  style='margin-bottom: 100rpx;'>
			<task-list :taskObj='item' @changeEnable='changeEnable' v-for="(item,index) in taskArry" :key='index'></task-list>
			<u-loadmore :status="status" />
		</view>

		<u-button type="primary"  text="创建任务" @click='next'></u-button>
		
	</view>
</template>

<script>
	import inputBox from "@/components/input-box/input-box.vue"
	import selectBox from "@/components/select-box/select-box.vue"
	import taskList from "@/components/task-list/task-list.vue"
	import {
		getTaskList,
		getTaskType
	} from "@/api/pagesA/period-task.js"

	export default {
		components: {
			inputBox,
			selectBox,
			taskList
		},
		data() {
			return {
				status: 'loadmore',
				// 任务类型
				typeRange: [
					{
						value: -1,
						text: "任务类型"
					},
				],
				// 执行人员

				propleRang: [
					{
						value: '',
						text: "执行人员"
					},
					{
						value: 1,
						text: "单人"
					},
					{
						value: 2,
						text: "多人"
					}
				],
				// 紧急程度
				urgenct: [
					{
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
						name: '',
						tackTypeId: '',
						urgency: '',
						selectPersonType: ''
					}
				},
				total: 0,
				listTotal: 0,
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
			change1(val) {
				this.obj.query.selectPersonType = val
				this.taskArry = []
				this.getTaskList()
			},
			change2(val) {

				this.obj.query.urgency = val
				this.taskArry = []
				this.getTaskList()
			},
			change3(val) {
				this.obj.query.tackTypeId = val
				this.taskArry = []
				this.getTaskList()
			},
			changeEnable() {
				this.getTaskList()
			},
			async getTaskList() {
				const res = await getTaskList(this.obj)
				console.log("this.taskArry123",this.taskArry)
				if(this.status == 'loading'){
					this.taskArry = [...this.taskArry,...res.data.list]
				}else{
					this.taskArry = res.data.list
				}
				if (this.total == this.listTotal) {
					this.status = 'nomore';
					
				}
				this.listTotal = this.taskArry.length
				console.log("this.listTotal",this.listTotal)
				this.total = res.data.pagination.total
				console.log("res", res)
				for (let item of this.taskArry) {
					for (let i of this.typeRange) {
						if (item.taskTypeId == i.value) {
							this.$set(item, 'taskTypeName', i.text)
						
						}
					}
					for (let i of this.urgenct) {
						if (item.urgency == i.value) {
							this.$set(item, 'urgencyName', i.text)
						
						}
					}
				}

				console.log("this.taskArry", this.taskArry)
			},

			async getTypeRang() {
				const res = await getTaskType({})
		
				res.data.map(i=> {
					i.text = i.name
					i.value = i.id
				})
				this.typeRange = [...this.typeRange,...res.data]

				console.log("this.typeRange", this.typeRange)

			},
			search() {
				this.taskArry = []
				this.getTaskList()
			},
			next() {
				uni.navigateTo({
					url: "/pagesA/pages/periodTask/creatTask-1"

				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .search {
		display: flex;
		width: 100%;
		justify-content: start;
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



	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.uni-pb-5 {
		padding-bottom: 10px;
	}

	::v-deep .u-button {
		position: fixed !important;
		bottom: 20rpx;
		font-size: 32rpx;
		height: 104rpx;
		line-height: 104rpx;
		
		text-align: center;
		background: #007aff;
		color: #fff;
		left: 50%;
		transform: translateX(-50%);
		margin: auto !important;
		width: 200rpx !important;
		
	
	
	}
</style>
