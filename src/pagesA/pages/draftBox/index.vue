<template>
	<view class="content">
		<u-search placeholder="请输入任务名称" bg-color='#ffffff' @custom='search' v-model='fromData.query.name'
			@search='search' @clear='search'>
		</u-search>
		<view class="search">
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select v-model="value1" :localdata="range1" @change="change1" :clear="false" ></uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select v-model="value2" :localdata="range2" @change="change2" :clear="false"></uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select v-model="value3" :localdata="range3" @change="change3" :clear="false"></uni-data-select>
			</view>
		</view>
		
		<view class="list-box" v-for="(item,index) in listData" :key="item.id">
			<view class="list-btn clearfix">
				<view class="left">
					<span>{{item.personIds.length>1 ? '多人':'单人'}}</span>
					<span>{{item.tackTypeName}}</span>
					<span class="sign">{{['特急','加急','普通'][item.urgency]}}</span>
				</view>
				<view class="right" @click="handerOpen(index)">
					<u-icon
							name="more-dot-fill"
							size="18"
					></u-icon>
				</view>
			</view>
			<view class="list-content">
				<view @click="next(`/pagesA/pages/draftBox/creatTask?id=${listData[index].id}`)">
					<view class="list-content-title">
						{{item.name}}
					</view>
					<view class="list-content-cont">
						{{item.taskContent}}
					</view>
					<view class="list-content-time">截止: {{item.deadlineTime.substring(0, 16)}}</view>
				</view>
			</view>
		</view>
		<u-button type="primary"  text="创建任务" @click="next('/pagesA/pages/draftBox/creatTask')"></u-button>
		<!-- <button type="primary" class='next'   @click="next()">创建任务</button> -->
		<u-popup closeable :show="show" mode="bottom"  @close="close" @open="open">
			<view class="popup_box">
					<view class="popup_box_text">
						{{listData.length >0 ? listData[index].name : ''}}
					</view>
					<view class="popup_box_list" @click='next(`/pagesA/pages/draftBox/creatTask?id=${listData[index].id}`)'>
						<image :src="amend" mode="widthFix"></image>
						<span>修改任务</span>
					</view>
					<view class="popup_box_list" @click="handeIssue()">
						<image :src="issue" mode="widthFix"></image>
						<span>发布任务</span>
					</view>
					<view class="popup_box_list" @click="handeRemove()">
						<image :src="remove" mode="widthFix"></image>
						<span>删除任务</span>
					</view>
			</view>
			</u-popup>
			<u-loadmore :status="status" />
	</view>
</template>

<script>
	import {orgList,taskList,issueRespTask,removeRespTask} from "@/api/pagesA/draftBox"
	import amend from '@/static/images/pageA/amend.png'
	import issue from '@/static/images/pageA/issue.png'
	import remove from '@/static/images/pageA/remove.png'
	export default{
		data(){
			return{
				amend,
				issue,
				remove,
				show:false,
				index:0,
				status: 'loadmore',
				fromData:{
					pageNum: 1,
					pageSize: 10,
					query:{
						statusList:[10],
						name:''
					}
				},
				listData:[],
				value1: -1,
				range1: [
					{
						value: -1,
						text: "执行人员"
					},
					{
						value: 1,
						text: "单人"
					},
					{
						value: 2,
						text: "多人"
				}],
				value2: -1,
				range2: [
					{
						value: -1,
						text: "紧急程度"
					},
					{
						value: 2,
						text: "普通"
					},
					{
						value: 1,
						text: "加急"
					},
					{
						value: 0,
						text: "特急"
				}],
				value3: -1,
				range3: [
					{
						value: -1,
						text: "任务类型"
					}]
			}
		},
		onLoad() {
			this.init()
		},
		onShow(){
			this.listData.length = 0
			this.gainData()
		},
		onHide(){
			this.show = false
		},
		onReachBottom() {
			if(this.dataNum == this.listData.length) return ;
			this.status = 'loading';
			this.fromData.pageNum = ++ this.fromData.pageNum;
			this.gainData()
		},
		methods:{
			async init(){
				const resOrg = await orgList()
				resOrg.data.map(i=> {
					i.text = i.name
					i.value = i.id
				})
				this.range3 = [...this.range3,...resOrg.data]
			},
			async gainData(){
				const resTask = await taskList(this.fromData)
				this.listData.push(...resTask.data.list)
				this.dataNum = resTask.data.pagination.total || 0
				if(this.dataNum == this.listData.length) this.status = 'nomore';
			},
			open() {
			},
			close() {
				this.show = false
				// console.log('close');
			},
			handerOpen(index){
				this.show = true
				this.index = index
			},
			search() {
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.gainData()
			},
			handeAmendr(){
				
			},
			async handeIssue(){
				const id = this.listData[this.index].id
				const res = await issueRespTask(id)
				uni.$u.toast(res.msg)
				if(res.msg == '操作成功')this.listData.splice(this.index,1)
				this.show = false
			},
			async handeRemove(){
				const id = this.listData[this.index].id
				const res = await removeRespTask(id)
				uni.$u.toast(res.msg)
				if(res.msg == '操作成功')this.listData.splice(this.index,1)
				this.show = false
			},
			change1(e) {
				if(e<0){
					delete this.fromData.query.selectPersonType
				}else{
					this.fromData.query.selectPersonType = e
				}
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.gainData()
			},
			change2(e) {
				if(e<0){
					delete this.fromData.query.urgencyList
				}else{
					this.fromData.query.urgencyList = [e]
				}
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.gainData()
			},
			change3(e) {
				if(e<0){
					delete this.fromData.query.tackTypeId
				}else{
					this.fromData.query.tackTypeId = e
				}
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.gainData()
			},
			next(url){
				uni.navigateTo({url})
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

	.uni-select__selector-item{
		font-size: 24rpx
	}
	.uni-select {
		border: none;
		border-bottom: none;
	}
}
.content{
	padding-bottom: 150rpx;
}
.popup_box{
	font-size: 30rpx;
	color: #333;
	padding: 0 10rpx;
	&_text{
		font-weight: bold;
		height:100rpx;
		line-height: 100rpx;
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	&_list{
		height:100rpx;
		line-height: 100rpx;
		display: flex;
		align-items:center;
		justify-content:center;
		border-top: 2rpx solid #E6E6E6;
		image{
			width: 30rpx;
			margin-right: 49rpx;
		}
	}
}
.text {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}
.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
}
.uni-pb-5 {
	padding-bottom: 10px;
}
.list-box {
	border-radius: 10rpx;
	width: 100%;
	background-color: #FFFFFF;
	padding: 20rpx;
	margin-bottom: 16rpx;
	box-sizing: border-box;
	.list-btn {
		margin-bottom: 6rpx;
		overflow: hidden;
		width: 100%;
		span {
			color: #026DFF;
			padding: 6rpx 12rpx;
			background-color: rgb(204,226,255);
			box-sizing: content-box;
			margin: 0 6rpx;
			font-size: 24rpx;
			border-radius: 6rpx;
		}
		.sign{
			color: #F7534F;
			background-color: rgb(253,221,220);
		}
	}
}
.list-content {
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
	.list-content-time{
		line-height: 50rpx;
		height: 50rpx;
		font-size: 24rpx;
		color: #4a4a4a;
	}
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
