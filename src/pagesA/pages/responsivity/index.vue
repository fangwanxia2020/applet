<template>
	<view class="content">

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
		<view class="table">
			<view class="table_tabs">
			<u-tabs :list="list"
			@change='changeTab'
			 itemStyle="padding-left: 15px; padding-right: 15px; height: 70rpx; width:100rpx"
			  lineWidth="80"
			  lineHeight='1'
			        lineColor="rgb(0, 121, 254)"
			        :activeStyle="{
			            color: 'rgb(0, 121, 254)',
			        }"
			></u-tabs>
			</view>
			<view class="table_list">
			
					<view class="list_box_1" v-for="(item,index) in taskArry" :key='index'>
						<view class="rank_name">
							<view :class="item.rank==1?'list_img_rank1':item.rank==2?'list_img_rank2':'list_img_rank3'" >{{item.rank}}</view>
						
							<view class="list_name">{{item.personName}}</view>
						</view>
					
						<view class="list_percentage">响应度: {{item.responsivity}}</view>
					</view>
			
			</view>
		</view>
		<u-loadmore :status="status" />
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
	} from "@/api/pagesA/responsivity.js"
	export default{
		data(){
			return{
				orgName:'',
				show:false,
				status: 'loadmore',
				obj: {
					"pageNum": 1,
					"pageSize": 10,
					"query": {
						beginType: 0,
						orgId: 1
					}
				},
				list:[
					{
						name:'本周'	
					},
					{
						name:'本月'	
					}
				],
				taskArry:[],
				total: 0,
				listTotal: 0,
				orgList:[]
			}
		},
		async onShow() {
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
		methods:{
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
			async get_org(){
				const res = await getOrg()
				this.$set(this.orgList,0,res.data)
			
				this.obj.query.orgId = res.data[0].id
				this.orgName = res.data[0].name
				console.log("this.orgList ",this.orgList )
			},
			changeTab(val){
				console.log("val",val)
				this.obj.query.beginType = val.index
				this.getList()
			},
			pickerConfirm(val){
				console.log("val",val)
				this.orgName =val.value[0].name
				this.obj.query.orgId =val.value[0].id 
				this.show = false
				this.getList()
			}
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
			    margin-bottom: 20rpx;
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
	
	::v-deep .u-input{
		width: 400rpx;
		    float: left;
			input{
				text-align: right;
			}
	}
	::v-deep .u-icon{
		height: 70rpx;
		line-height: 70rpx;
	}
	
	.table{
		background-color: #FFFFFF;
		padding-bottom: 50rpx;
		&_tabs{
			height: 70rpx;
			width: 100%;
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			border-bottom: 1rpx solid #EEEEEE;
		}
		&_list{
			
		}
	}
	
	.list_box_1 {
		background-color: #E5E5E5;
		padding: 20rpx;
		display: flex;
		height: 50rpx;
		justify-content: space-between;
		border-bottom: 1px dashed #eee;
		margin: 20rpx;
		margin-top: 0;
		border-radius: 10rpx;
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
</style>
