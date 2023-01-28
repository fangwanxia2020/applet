<template>
	<view class="content">
		<u-search placeholder="请输入姓名" bg-color='#ffffff' @custom='search' v-model='obj.query.personName'
			@search='search' @clear='search'>
		</u-search>
<!-- 		<view class="org">
			<view class="org_left"> 局办</view>
			<view class="org_right" @click="show = true">
				<u-input v-model='orgName' :inputAlign='right' :auto-height='true'  disabled border='false' placeholder="组织人社局" disabledColor='#ffffff'></u-input>
				<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
			</view>
		</view> -->
		
		<view class="content_list1">
			<view class="content_list1_item" @click="show = true">
				<view class="">
					局办：
				</view>
				<view class="content_list1_item_icon">
					<text>
						{{orgName}}
					</text>
					<u-icon name="arrow-right" color="#999999" size="18" ></u-icon>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="list_box" v-for="(item,index) in taskArry" :key='index'>
				<view class="list_box_1">
					<view class="rank_name">
						<view :class="item.rank==1?'list_img_rank1':item.rank==2?'list_img_rank2':'list_img_rank3'" >{{item.rank}}</view>
					
						<view class="list_name">{{item.personName}}</view>
					</view>

					<view class="list_percentage">占比: {{item.proportion + 0}}%</view>
				</view>
				<view class="list_box_2">
					<view>
						<view>{{item.expireTask}}</view>
						<view>逾期</view>
					</view>
					<view>
						<view>{{item.urgeTask}}</view>
						<view>督办</view>
					</view>
					<view>
						<view>{{item.attentionTask}}</view>
						<view>领导关注</view>
					</view>
					<view>
						<view>{{item.createTask}}</view>
						<view>创建任务</view>
					</view>
					<view>
						<view>{{item.processingTask}}</view>
						<view>进行中</view>
					</view>

				</view>
				<view>

				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
		<u-picker
		 :show="show" 
		 :columns="orgList" 
		 keyName="name"
		 @cancel="show = false"
		 @confirm="pickerConfirm"
		 ></u-picker>
	</view>
</template>

<script>
	import {
		getList,
		getOrg
	} from "@/api/pagesA/distribute.js"
	export default {
		data() {
			return {
				orgName:'',
					show:false,
				status: 'loadmore',
				obj: {
					"pageNum": 1,
					"pageSize": 10,
					"query": {
						personName: '',
						orgIdList: []
					}
				},
				taskArry: [{
						value: '22',
						lable: '逾期'
					},
					{
						value: '22',
						lable: '督办'
					},
					{
						value: '22',
						lable: '领导关注'
					},

					{
						value: '22',
						lable: '创建任务'
					},
					{
						value: '22',
						lable: '进行中'
					},
				],
				total: 0,
				listTotal: 0,
				orgList:[]
			}
		},
	async	onShow() {
			await this.get_org()
			this.getList()
		},
		onReachBottom() {
			console.log("this.listTotal456", this.listTotal.length)
			if (this.total == this.listTotal) {
				this.status = 'nomore';
				return
			}
			this.status = 'loading';
			this.obj.pageNum = ++this.obj.pageNum;
			this.getList()
		},
		methods: {
			pickerConfirm(val){
				console.log("val",val)
				this.orgName =val.value[0].name
				this.obj.query.orgIdList[0] =val.value[0].id 
				this.obj.pageNum = 1
				this.taskArry = []
				this.show = false
				this.getList()
			},
			async get_org(){
				const res = await getOrg()
				this.$set(this.orgList,0,res.data)
			
				// this.obj.query.orgId = res.data[0].id
				// this.orgName = res.data[0].name
				console.log("this.orgList ",this.orgList )
			},
			search() {
				this.obj.pageNum = 1
				this.obj.pageSize = 10
				this.getList()
			},
			async getList() {
				const res = await getList(this.obj)
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
			},
		}
	}
</script>

<style lang="scss" scoped>
.content{
		&_list1{
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
		}
	.list {

		.list_box {
			margin: 20rpx 0;
			border-radius: 10rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
			background-color: #fff
		}

		.list_box_1 {
			padding: 30rpx 0;
			display: flex;
			height: 50rpx;
			justify-content: space-between;
			border-bottom: 1px dashed #eee;
			margin: 20rpx;
			margin-top: 0;

			.rank_name {
				display: flex;
				justify-content: space-between;
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
			.list_img_rank3 {
				width: 50rpx;
				height: 50rpx;
				border-radius: 25rpx;
				background-color: #A3A3A3;
				color: #FFFFFF;
				text-align: center;
				line-height: 50rpx;
			}

			.list_name {
				margin-left: 20rpx;
			}
		}

		.list_box_2 {
			display: flex;
			justify-content: space-around;
			text-align: center;
			line-height: 50rpx;
			padding-bottom: 30rpx;
		}
	}
</style>
