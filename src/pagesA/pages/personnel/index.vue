<template>
	<view>

		<view class="table_tabs">
			<view v-for="(item , index) in list" :key="index" style="padding-bottom: 14rpx;"
				:class="item.active?'active':''"  @click="changTab(index)">
				<view class="tab_text">{{item.label}}</view>
				<view class="tab_text">{{item.value}}项</view>
			</view>
		</view>
		<view class="table_list">
			<view class="list_title">
				<view class="cnt_text_l">姓名</view>
				<view class="cnt_text_c">所在部门</view>
				<view class="cnt_text_r">进行中任务</view>
			</view>
			<view class="list_cnt">
				<view class="cnt_item" v-for="(item , index) in tableData" :key='index'>
					<view class="cnt_text_l">{{item.personName}}</view>
					<view class="cnt_text_c">{{item.personDept}}</view>
					<view class="cnt_text_r">{{item.taskCount}}</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
	</view>
</template>

<script>
	    import {
	        getTask,
	        getCount
	    } from "@/api/pagesA/personnel.js";
	export default {
		data() {
			return {
				   tableData: [],
				                form: {
				                    pageNum: 1,
				                    pageSize: 10,
				                    query: {
				                        dateType: 0,
				                    }
				                },
				list: [{
						value: '',
						label: '今天有进度',
						date: 1,
						active: true
					},
					{
						value: '',
						label: '3天内有进度',
						date: 2,
						active: false
					},
					{
						value: '',
						label: '7天内有进度',
						date: 3,
						active: false
					},
					{
						value: '',
						label: '7天外有进度',
						date: 4,
						active: false
					},
					{
						value: '',
						label: '超7天无进度',
						date: 5,
						active: false
					},
				],
				total: 0,
				listTotal: 0,
				status: 'loadmore'
			}
		},
		onReachBottom() {
			console.log("this.listTotal456", )
			if (this.total == this.listTotal) {
				this.status = 'nomore';
				return
			}
			this.status = 'loading';
			this.form.pageNum = ++this.form.pageNum;
			this.getList()
		},
		onShow(){
			 this.getCount()
			           this.listTab()
		},
		methods:{
			     async getList() {
			                const res = await getTask(this.form)
			                // this.tableData = res.data.list
							
							if (this.status == 'loading') {
								this.tableData = [...this.tableData, ...res.data.list]
							} else {
								this.tableData = res.data.list
							}
							if (this.total == this.listTotal) {
								this.status = 'nomore';
										
							}
							for(let item of this.tableData ){
								item.personDept = item.personDept==null?'':item.personDept
							}
							this.listTotal = this.tableData.length
							console.log("this.listTotal", this.listTotal)
							this.total = res.data.pagination.total
			              
			            },
			
			           async getCount(){
			                   const res = await getCount('person')
			                   for( let index in res.data){
			                    this.list[index].value = res.data[index]
			                   }
			            },
						changTab(index){
							this.form.pageNum = 1
							this.form.pageSize = 10
							for(let i  in this.list ){
								if(this.list[index].active == this.list[i].active && this.list[index].active== true){
									return
								}
							this.list[i].active = false
							}
							this.list[index].active = true
							this.listTab()
						},
						listTab(){
							for(let item  of this.list ){
								if(item.active == true){
									this.form.query.dateType = item.date
									this.getList()
								}
							}
						}
						
		}
	}
</script>

<style lang="scss" scoped>
	.table_tabs {
		background-color: #FFFFFF;

		text-align: center;
		border: 1rpx solid #eeeeee;
		display: flex;
		justify-content: space-between;
		font-size: 12rpx;
		padding: 14rpx 10rpx;
		padding-bottom: 0;

		.tab_text {
			font-size: 24rpx;
			line-height: 50rpx;
		}
	}

	.active {
		color: rgb(0, 121, 254);
		border-bottom: 1rpx solid rgb(0, 121, 254);
	}

	.table_list {
		width: 100%;
		padding: 16rpx;
		box-sizing: border-box;
		padding-bottom: 50rpx;

		.list_title {
			background-color: #FFFFFF;
			padding: 14rpx 30rpx;
			height: 70rpx;
			display: flex;
			justify-content: space-between;
			line-height: 70rpx;
			border-radius: 10rpx;

			view {
				height: 70rpx;
				line-height: 70rpx;
				width: 30%;
			
			}
		}
	}
	.list_cnt{
	background-color: #FFFFFF;
	padding: 10rpx 0;
	margin-top: 16rpx;
	border-radius: 10rpx;
	.cnt_item{
		background-color:  #E5E5E5;
		padding: 10rpx 10rpx;
		height: 70rpx;
		display: flex;
		justify-content: space-between;
		line-height: 70rpx;
		border-radius: 10rpx;
		margin: 16rpx;
	
	}
	}
	
	.cnt_text_l{
		width: 30%;
		text-align: left;
		height: 70rpx;
		line-height: 70rpx;
	}
	.cnt_text_c{
		width: 30%;
		text-align: center;
		height: 70rpx;
		line-height: 70rpx;
	}
	.cnt_text_r{
		width: 30%;
		text-align: right;
		height: 70rpx;
		line-height: 70rpx;
	}
</style>
