<template>
	<view class="content">
		<u-search placeholder="请输入任务名称" bg-color='#ffffff' @custom='search' v-model='fromData.query.name'
			@search='search' @clear='search'>
		</u-search>
		<view class="content_status">
			<u-subsection :list="subsectionList" :bgColor="'#ffffff'" :current="curNow" @change="sectionChange"></u-subsection>
		</view>
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
		
		<view class="list-box" v-for="(item,index) in adapterData" :key="item.id">
			<view class="list-btn clearfix">
				<view class="left" >
					<span>{{item.personIds.length>1 ? '多人':'单人'}}</span>
					<span>{{item.tackTypeName}}</span>
					<span class="sign">{{['特急','加急','普通'][item.urgency]}}</span>
				</view>
				<view class="right" @click="handerOpen(index)" v-if="!arra.includes(item.status) || item.personIds.length == 1">
					<u-icon
							name="more-dot-fill"
							size="18"
					></u-icon>
				</view>
			</view>
			<view class="list-content"  >
				<view @click="next(`/pagesA/pages/havePublished/details?id=${item.id}&viewType=${item.personIds.length>1?0:1}`)">
					<view class="list-content-title">
						{{item.name}}
					</view>
					<view class="list-content-cont">
						{{item.taskContent}}
					</view>
					<view class="list-content-time">
						截止: {{item.deadlineTime.substring(0, 16)}} 
						<text class="list-content-status" :class="item.statusClass">{{item.statusName}}</text>
					</view>
				</view>
				<view class="list-content-progress">
					<u-line-progress activeColor="#026DFF" :percentage="item.taskProgress" :showText="false"></u-line-progress>
					<view class="list-content-progress-percent">
						{{item.taskProgress}}%
					</view>
					<view class="list-content-progress-handel">
						<view class=""  @click="handleConcern(item.id,item.taskPsnAttentionId,index)">
							<image style="width: 27rpx;height: 24rpx;"  v-if="item.isTaskPsnAttention == 0" :src="concern" mode="widthFix"></image>
							<image style="width: 27rpx;height: 24rpx;"  v-else :src="concern_hl" mode="widthFix"></image>
							
						</view>
						<view class="" v-if="item.personIds.length<2"  @click="handleUrge(item.id,item.isUrge,index)">
							<image style="height: 28rpx;" :src="remind"  v-if="item.isUrge == 0" mode="widthFix"></image>
							<image style="height: 28rpx;" :src="remind_hl" v-else mode="widthFix"></image>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<u-popup v-if="listData.length > 0" closeable :show="show" mode="bottom"  @close="show = false">
			<view class="popup_box">
					<view class="popup_box_text">
						{{listData[index].name}}
					</view>
					<view v-if="!arra.includes(listData[index].status)" class="popup_box_list" @click="handeRemove()">
						<image :src="obsolete" mode="widthFix"></image>
						<span>作废任务</span>
					</view>
					<view class="popup_box_list"
					v-if="listData[index].personIds.length == 1"
					@click="handleSubtask(listData[index].id)"
					>
						<image :src="subtask" mode="widthFix"></image>
						<span>查看子任务</span>
					</view>
				</view>
			</u-popup>
			<u-popup v-if="listData.length > 0" closeable :show="sonShow" mode="bottom"  @close="sonShow = false">
				<view class="popup_box">
					<uni-table  ref="table" :stripe='false'  emptyText="暂无更多数据" >
						<uni-tr>
							<uni-th width="100" align="left" class="table-count-1">负责人</uni-th>
							<uni-th width="100" align="left" class="table-count-2">阶段</uni-th>
							<uni-th width="80" align="left" class="table-count">任务进度</uni-th>
							<uni-th width="100" align="left" class="table-count">详情</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in tableDataList" :key="index">
							<uni-td class="table-count-1">
								<view class="name">{{ item.personName }}</view>
							</uni-td>
							<uni-td class="table-count-2">
								<view class="name">{{ item.statusName }}</view>
							</uni-td>
							<uni-td class="table-count">
								<view class="name">
									<view style="width: 60rpx; height:60rpx;">
										<arprogress
										width='80' 
										borderWidth="12"
										:percent="item.taskProgress"
										>
											<text style="font-size: 24rpx;transform: scale(0.8); white-space:nowrap;">{{item.taskProgress || 0}}%</text>
										</arprogress>
									</view>
								</view>
							</uni-td>
							<uni-td class="table-count">
								<view class="name" style="color: #026DFF;" @click="next('/pages/jobJacket/detail?id='+item.id)">查看</view>
							</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</u-popup>
			<u-loadmore :status="status" />
	</view>
</template>

<script>
	import {orgList,taskList,cancelTaskType,respTaskInstance,respTaskList,urgeTask} from "@/api/pagesA/havePublished"
	import {addAndCancel} from "@/api/pages/jobJacket"
	import concern from '@/static/images/pageA/concern.png'
	import concern_hl from '@/static/images/pageA/concern_hl.png'
	import remind from '@/static/images/pageA/oversee.png'
	import remind_hl from '@/static/images/pageA/oversee_hl.png'
	import obsolete from '@/static/images/pageA/obsolete.png'
	import subtask from '@/static/images/pageA/subtask.png'
	import arprogress from '@/components/ar-circle-progress/index.vue'
	export default{
		data(){
			return{
				concern,
				concern_hl,
				remind,
				remind_hl,
				obsolete,
				subtask,
				show:false,
				sonShow:false,
				index:0,
				status: 'loadmore',
				arra:[40,50,60],
				subsectionList: ['全部', '进行中', '已逾期', '待审核','已完成', '已关闭'],
				curNow:0,
				fromData:{
					pageNum: 1,
					pageSize: 10, 
					query:{
						statusList:[20,30,40,50,60],
						name:''
					}
				},
				listData:[],
				deptList:[],
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
		components: {
			arprogress
		},
		onLoad() {
			this.init()
		},
		onShow(){
			this.fromData.pageNum = 1
			this.fromData.pageSize = 10
			this.listData.length = 0
			this.gainData()	
		},
		onHide(){
			this.show = false
		},
		computed:{
			tableDataList(){
				return this.deptList.filter(item =>{
					return item.statusName = ['草稿','进行中','逾期','待审核','完成','作废'][Number(item.status)/10 - 1]
				})
			},
			adapterData(){
				return this.listData.filter(item =>{
					[30,50,60].includes(item.status) ? item.statusClass = 'red' : item.statusClass = 'blue'
					item.statusName = ['草稿',`剩余${item.comingToEndDateTime}`,`已逾期${item.comingToEndDateTime}`,'待审核','已完成','已关闭'][Number(item.status)/10 - 1]
					return item
				})
			},
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
			search() {
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.gainData()
			},
			handerOpen(index){
				this.show = true
				this.index = index
			},
			sectionChange(index){
				this.fromData.pageNum = 1
				this.fromData.pageSize = 10
				this.listData.length = 0
				this.curNow = index
				this.fromData.query.statusList = [(Number(index)+1)*10]
				if(index == 0) delete this.fromData.query.statusList
				this.gainData()
			},
			//作废任务
			async handeRemove(){
				const {listData,index} = this
				const id = listData[index].id
				const res = await cancelTaskType(id)
				uni.$u.toast(res.msg)
				this.show = false
				if(res.msg == '操作成功') this.$set(listData[index],'status',60)
				if(this.curNow != 0) listData.splice(index,1)
			},
			//关注
			async handleConcern(id,taskPsnAttentionId,index){
				let data = {}
				this.listData[index].isTaskPsnAttention ? data.id = taskPsnAttentionId : data.taskId = id
				const res = await addAndCancel(data)
				if(res.msg == '操作成功'){
					//未关注不存在taskPsnAttentionId值，所以关注的时候需要把taskPsnAttentionId赋值上去
					if(!this.listData[index].isTaskPsnAttention){
						const fromData={
							pageNum: Math.ceil((index+1)/10),
							pageSize: 10,
							query:this.fromData.query
						}
						const resTask = await taskList(fromData)
						const currentIndex = index+10 - Math.ceil((index+1)/10)*10
						this.listData[index].taskPsnAttentionId = resTask.data.list[currentIndex].taskPsnAttentionId
					}
					this.$set(this.listData[index],'isTaskPsnAttention',!this.listData[index].isTaskPsnAttention)
				}
			},
			//督办
			async handleUrge(id,isUrge,index){
				if(isUrge) return
				const data = {taskId:id}
				const res = await urgeTask(data)
				if(res.msg == '操作成功'){
					this.$set(this.listData[index],'isUrge',!this.listData[index].isUrge)
				}
			},
			//子任务
			handleSubtask(id) {
				const queryParams= {
          pageNum: 1,
          currPage: 1,
          pageSize: 10,
          isPeriodicTask: 1,
          query: {
            isPeriodicTask: 1,
						parentId:id
          }
        }
				respTaskList(queryParams).then(response => {
					this.deptList = response.data.list
					this.show = false
					if(this.deptList.length){
						this.sonShow = true
					}else{
						uni.$u.toast('暂无子任务')
					}
				});
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
	.uni-select__input-text{
		font-size: 24rpx
	}
	.uni-select {
		border: none;
		border-bottom: none;
	}
}
::v-deep .u-search{
	padding: 0 20rpx;
	margin: 20rpx 0 !important;
}
.content{
	padding: 0;
	padding-bottom: 20rpx;
	&_status{
		display: flex;
		font-size: 28rpx;
		&_list{
			font-weight: 500;
		}
	}
}
.next{
	position: fixed;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
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
.list-box {
	border-radius: 10rpx;
	background-color: #FFFFFF;
	padding: 20rpx;
	margin: 0 20rpx 16rpx;
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
		.list-content-status{
			margin-left: 20rpx;
		}
		.blue{
			color: #026DFF;
		}
		.red{
			color: #F7534F;
		}
	}
	.list-content-progress{
		display: flex;
		align-items: center;
		.list-content-progress-percent{
			font-size: 24rpx;
			color:#026DFF;
			margin-left: 27rpx;
		}
		.list-content-progress-handel{
			width: 120rpx;
			text-align: right;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			view{
				width: 50%;
			}
			image:nth-of-type(2){
				width: 27rpx;
				margin-left: 42rpx;
			}
		}
		
		image{
			width: 30rpx;
		}
	}
}
::v-deep .u-button{
	margin: auto !important;
	width: 200rpx !important;
	height: 70rpx !important;
}

</style>
