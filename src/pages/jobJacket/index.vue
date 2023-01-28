<template>
	<view class="content">
		<u-navbar :title="jobTitle">
			<view class="u-nav-slot" slot="left"  @click="jobShow = true">
				<u-icon
						name="list"
						size="19"
				></u-icon>
			</view>
		</u-navbar>
		<u-search placeholder="请输入任务名称" bg-color='#ffffff' @custom='search' v-model='fromData.query.name'
			@search='search' @clear='search'>
		</u-search>
		<view class="content_status">
			<u-subsection :list="subsectionList" :bgColor="'#ffffff'" :current="curNow" @change="sectionChange"></u-subsection>
		</view>
		<view class="search">
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select v-model="value2" :localdata="range2" @change="change2" :clear="false"></uni-data-select>
			</view>
			<view class="uni-px-5 uni-pb-5 search-box">
				<uni-data-select v-model="value3" :localdata="range3" @change="change3" :clear="false"></uni-data-select>
			</view>
		</view>
		
		<view class="list-box" v-for="(item,index) in adapterData" :key="item.id + item.treeIndex">
			<view class="list-btn clearfix">
				<view class="left">
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
			<view class="list-content"  >
				<view  @click="next(`/pages/jobJacket/detail?id=${item.id}&selectPersonType=${item.selectPersonType}&viewType=0`)">
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
					<view class="list-content-progress-handel"  @click="handleConcern(item.id,item.taskPsnAttentionId,index)">
						<image :src="concern" v-show="item.isTaskPsnAttention == 0" mode="widthFix"></image>
						<image :src="concern_hl" v-show="item.isTaskPsnAttention == 1" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<u-popup closeable v-if="listData.length >0" :show="show" mode="bottom"  @close="close">
			<view class="popup_box">
					<view class="popup_box_text">
						{{listData[index].name}}
					</view>
					<view class="popup_box_list" 
					v-if="listData[index].status == 20 ||  listData[index].status == 30" 
					@click="next(`/pages/jobJacket/progressTask?id=${listData[index].id}&selectPersonType=${listData[index].selectPersonType}`)"
					>
						<image :src="renewal" mode="widthFix"></image>
						<span>进度更新</span>
					</view>
					<view class="popup_box_list"
					v-if="listData[index].status == 20 ||  listData[index].status == 30" 
					@click="handleAudit(5)"
					>
						<image :src="submit" mode="widthFix"></image>
						<span>提交审核</span>
					</view>
					<view class="popup_box_list" 
					v-if="listData[index].status == 20 ||  listData[index].status == 30" 
					@click="next('/pages/jobJacket/resolveTask?id='+ listData[index].id)"
					>
						<image :src="resolve" mode="widthFix"></image>
						<span>分解任务</span>
					</view>
					<view class="popup_box_list"
					v-if="listData[index].status == 40" 
					@click="handleAudit(12)"
					>
						<image :src="resolve" mode="widthFix"></image>
						<span>撤回任务</span>
					</view>
					<view class="popup_box_list" @click="handleSelect(listData[index].id)">
						<image :src="missionFail" mode="widthFix"></image>
						<span>任务夹</span>
					</view>
					<view class="popup_box_list"
					v-if="listData[index].secondaryTaskList" 
					@click="handleSubtask(index)"
					>
						<image :src="subtask" mode="widthFix"></image>
						<span>查看子任务</span>
					</view>
			</view>
			</u-popup>
			
			<u-modal :show="modalShow"  
			@close="modalShow = false" 
			@cancel="modalShow = false" 
			@confirm="hendleCommit(listData[index].id,listData[index].taskProgress,index)"
			:closeOnClickOverlay="true" 
			:showCancelButton="true" 	
			:title="title" 
			:content='content'
			></u-modal>
			
			
			<u-modal :show="deleteShow"
			@close="deleteShow = false" 
			@cancel="deleteShow = false" 
			@confirm="hendleDelete()"
			:closeOnClickOverlay="true" 
			:showCancelButton="true" 	
			:title="'提示'" 
			:content="'是否删除该文件夹？'"
			></u-modal>
			
			
			<u-popup :show="jobShow"  @close="jobShow = false"  mode="left">
				<view class="content_right">
					<view class="content_right_box" v-for="(item,index) in jobJacketList" :key="index">
						<view class="content_right_box_title">
							{{item.name}}
						</view>
						<view class="content_right_box_task"
						 v-for="(list,indexs) in item.jacketList" 
						 :key="indexs"
						 :class="{'content_right_box_checked':list.jobShow}" 
						>
							<view style="flex-grow:2;height: 55px;line-height: 55px;"  
							@click="handleSwitch(index,indexs,list.name)"
							>
								<image style="height:24rpx" :src="folder" mode="widthFix"></image>{{list.name}}
							</view>
							<view>
								<span>{{list.taskNum}}</span>
								<span class="content_right_box_task_symbol" v-if="list.handleShow" @click="handlePop(index,indexs)">···</span>
								<view class="content_right_box_task_handle" v-if="list.handleShow" v-show="list.popShow && overlayShow">
									<view class="" @click="handleChange(list.id)">
										修改文件夹
									</view>
									<view  @click="handleDeleteJob(list.id)">
										删除文件夹
									</view>
									<view
									v-if="indexs != 0"
									 @click="handleMove('up',list.id,item.jacketList,indexs)"
									>
										上移文件夹
									</view>
									<view 
									v-if="indexs != item.jacketList.length-1"
									@click="handleMove('down',list.id,item.jacketList,indexs)"
									>
										下移文件夹
									</view>
								</view>
							</view>
						</view>
						<view class="content_right_add" @click="handleNew()">
							+添加文件夹
						</view>
					</view> 
				</view>
				<u-popup :show="newShow" @close="newShow = false" mode="center" zIndex="10100" closeable>
					<view class="new">
							<view class="new_text">
								{{textValue}}文件夹
							</view>
							<view class="new_ipt">
								<u-input
									placeholder="任务夹名称（最多五个汉字）"
									border="bottom"
									fontSize="13px"
									v-model="jobValue"
								></u-input>
							</view>
							<button @click="handleConfirm()">确定</button>
					</view>
				</u-popup>
				<u-overlay :show="overlayShow" zIndex="10075" @click="closePop"></u-overlay>
			</u-popup>
			
			
			
			<u-popup closeable :show="moveShow" mode="bottom"  @close="moveShow = false">
				<view class="taskBox">
					<view class="taskBox_top">
						任务夹
					</view>
					<view class="taskBox_text">
						通用任务夹
					</view>
					<view class="taskBox_radio">
						<u-radio-group
						    v-model="radiovalue1"
						    placement="column"
						  >
						    <u-radio
									:disabled="true"
						      :customStyle="{marginBottom: '8px'}"
						      v-for="(item, index) in generalData"
						      :key="item.id"
						      :label="item.name"
						      :name="item.id"
						    >
						    </u-radio>
						  </u-radio-group>
					</view>
					<view class="taskBox_text">
						我的文件夹
					</view>
					<view class="taskBox_radio">
						<!-- <u-radio-group
						    v-model="radiovalue2"
						    placement="column"
						  >
						    <u-radio
									@change="radioChange(index)" 
						      :customStyle="{marginBottom: '8px'}"
						      v-for="(item, index) in myData"
						      :key="item.id"
						      :label="item.name"
						      :name="item.id"
						    >
						    </u-radio>
						  </u-radio-group> -->
							<uni-data-checkbox  max="1" multiple v-model="radiovalue2" :localdata="myData"  @change="radioChange"></uni-data-checkbox>
					</view>
					<view class="taskBox_btn">
						<u-button  text="取消" @click="moveShow = false"></u-button>
						<u-button type="primary" text="完成" @click="handeComplete"></u-button>
					</view>
				</view>
			</u-popup>
			
			
			<u-loadmore :status="status" />
	</view>
</template>

<script>
	import inputBox from "@/components/input-box/input-box.vue"
	import {orgList,taskList,cancelTaskType,getInfoTask} from "@/api/pagesA/havePublished"
	import {listByType,moveFolder,listPageByFolder,removeFolder,editFolder,addFolder,respCommitRec,addAndCancel,transferTask} from "@/api/pages/jobJacket"
	
	import concern from '@/static/images/pageA/concern.png'
	import concern_hl from '@/static/images/pageA/concern_hl.png'
	import renewal from '@/static/images/pageA/renewal.png'
	import submit from '@/static/images/pageA/submit.png'
	import resolve from '@/static/images/pageA/resolve.png'
	import missionFail from '@/static/images/pageA/missionFail.png'
	import subtask from '@/static/images/pageA/subtask.png'
	import folder from '@/static/images/pageA/folder.png'
	
	export default{
		components:{inputBox},
		data(){
			return{
				concern,
				concern_hl,
				renewal,
				submit,
				resolve,
				missionFail,
				subtask,
				folder,
				checkbox6:'',
				hobby: [{"value": 0,"text": "篮球"	},{"value": 1,"text": "足球"},{"value": 2,"text": "游泳"}],
				concernShow:false,
				deleteShow:false,
				show:false,
				jobShow:false,
				overlayShow:false,
				newShow:false,
				moveShow:false,
				index:0,
				modalShow:false,
				jobTitle:'任务夹',
				title:'提示',
				content:'是否提交审批',
				status: 'loadmore',
				jobJacketList:[],
				oldIndex:0,
				oldIndexs:0,
				switchIndex:0,
				switchIndexs:0,
				folderIndex:null,
				serialIndex:null,
				radiovalue1:'',
				radiovalue2:'',
				jobValue:'',
				textValue:'',
				subsectionList: ['全部', '进行中', '已逾期', '待审核', '已完成', '已关闭'],
				curNow:0,
				fromData:{
					pageNum: 1,
					pageSize: 10,
					query:{
						folderName:'全部计划',
						name:''
					}
				},
				listData:[],
				jobData:[],
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
		computed:{
		    dataList(){
		      
		    },
				generalData(){
					return this.jobData.filter(item => item.folderTypeName == '通用任务夹')
				},
				myData(){
					return this.jobData
					.filter(item => item.folderTypeName == '我的文件夹')
					.map((item,index) =>{
						item.text = item.name
						item.value = item.id
						item.index = index
						return item
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
		onLoad() {
		},
		onShow(){
			this.fromData.pageNum = 1
			this.fromData.pageSize = 10
			this.fromData.query.folderName = '全部计划'
			this.jobTitle = '任务夹'
			this.oldIndex = 0
			this.oldIndexs = 0
			this.switchIndex = 0
			this.oldIndex = 0
			this.listData.length = 0
			this.gainData()
			
			this.init()
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
				const jobData = await listByType()
				this.jobData = jobData.data
				this.jobJacketList = this.filterData()
				const resOrg = await orgList()
				resOrg.data.map(i=> {
					i.text = i.name
					i.value = i.id
				})
				this.range3 = [...this.range3,...resOrg.data]
			},
			filterData(){
				let num = 0
				this.jobData.filter(item => {
				  if(item.folderTypeName == '通用任务夹'){
				    num += Number(item.taskNum)
				  }
				})
				let arr = [{
				  name:'通用任务夹',
				  jacketList:[...[{
				      name:'全部计划',
				      jobShow:true,
				      taskNum:num
				      }],
				      ...this.jobData
				      .filter(item => item.folderTypeName == '通用任务夹')
				      .map(job =>({
				        ...job,
				        jobShow:false
				      }))]
				    },
				  {
				    name:'我的文件夹',
				    jacketList:this.jobData
				    .filter(item => item.folderTypeName == '我的文件夹')
				    .map(job =>({
				      ...job,
				      jobShow:false,
				      handleShow:true,
							popShow:false
				    }))
				  }]
				return arr
			},
			async gainData(){
				const resTask = await listPageByFolder(this.fromData)
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
			// 提交审核
			handleAudit(type){
				type == 12 ? this.content = '是否撤回任务' : this.content = '是否提交审批'
				this.show = false
				this.modalShow = true
				this.commitType = type
			},
			//任务提交或撤回
			async hendleCommit(id,taskProgress,index){
				const {commitType,listData,curNow} = this
				if(commitType == 5 && taskProgress != 100){
					this.modalShow = false
					uni.$u.toast('请更新进度至100%才能提交审批！')
					return
				}
				const data ={
					taskId:id,
					commit:commitType
				}
				const res = await respCommitRec(data)
				this.modalShow = false
				uni.$u.toast(res.msg)
				if(res.code == 200 && this.curNow != 0){
					listData.splice(index,1)
				}else if(res.code == 200 && curNow == 0){
					commitType == 5 ? this.$set(listData[index],'status',40) : this.$set(listData[index],'status',20)
				}
			},
			//选择文件夹
			handleSelect(id){
				getInfoTask(id).then(res=>{
					
					this.radiovalue1 = res.data.folderId
					
					if(res.data.myFolderIds) {
						this.radiovalue2 = res.data.myFolderIds ||  ''
						this.myFolderId = res.data.myFolderIds[0] || null
						this.myData.map((i,index)=>{
							if(i.id == res.data.myFolderIds[0]) this.folderIndex = index
						})
					}
					this.show = false
					this.moveShow = true
				})
			},
			//选择任务夹
			async handeComplete(){
				if(this.myFolderId == this.radiovalue2[0]){
					uni.$u.toast('操作成功')
					this.moveShow = false
					return
				}
				
				const {listData,index,switchIndexs,serialIndex,folderIndex} = this
				const data = {
					sourceFolderId:this.radiovalue2.length == 0 ? '' : this.radiovalue1,
					targetFolderId:this.radiovalue2.length == 0 ? this.myFolderId : this.radiovalue2[0],
					taskId:listData[index].id
				}
				const res = await transferTask(data)
				this.moveShow = false
				this.myFolderId = null
				uni.$u.toast(res.msg)
				if(res.code == 200 && this.switchIndex ==1){
					listData.splice(index,1)
					this.$set(this.jobJacketList[1].jacketList[switchIndexs],'taskNum',this.jobJacketList[1].jacketList[switchIndexs].taskNum - 1)
					if(serialIndex != null) this.$set(this.jobJacketList[1].jacketList[serialIndex],'taskNum',this.jobJacketList[1].jacketList[serialIndex].taskNum + 1)
				}else if(res.code == 200 && this.switchIndex == 0){
					if(folderIndex != null) this.$set(this.jobJacketList[1].jacketList[folderIndex],'taskNum',this.jobJacketList[1].jacketList[folderIndex].taskNum - 1)
					if(serialIndex != null) this.$set(this.jobJacketList[1].jacketList[serialIndex],'taskNum',this.jobJacketList[1].jacketList[serialIndex].taskNum + 1)
				}
			},
			//记录点击的index，用于文件夹列表taskNum增减
			radioChange(e){
				e.detail.data.length > 0? this.serialIndex = e.detail.data[0].index : this.serialIndex = null
			},
			//前往子任务列表
			handleSubtask(index){
				uni.setStorageSync('secondaryTaskList',this.listData[index].secondaryTaskList)
				this.next('/pages/jobJacket/subtask?id='+this.listData[index].id)
			},
			handlePop(index,indexs){
				this.overlayShow = true
				this.popIndex = index
				this.popIndexs = indexs
				this.$set(this.jobJacketList[index].jacketList[indexs],'popShow',true)
			},
			closePop(){
				this.overlayShow = false
				const {popIndex,popIndexs} = this
				this.$set(this.jobJacketList[popIndex].jacketList[popIndexs],'popShow',false)
			},
			//切换文件夹
			handleSwitch(index,indexs,name){
				if(index == this.oldIndex && indexs == this.oldIndexs) return
				this.switchIndex = index
				this.switchIndexs = indexs
				this.$set(this.jobJacketList[index].jacketList[indexs],'jobShow',true)
				this.$set(this.jobJacketList[this.oldIndex].jacketList[this.oldIndexs],'jobShow',false)
				this.oldIndex = index
				this.oldIndexs = indexs
				this.fromData.query.folderName = name
				this.listData.length = 0
				this.gainData()
				this.jobTitle = name
				this.jobShow = false
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
						const resTask = await listPageByFolder(fromData)
						const currentIndex = index+10 - Math.ceil((index+1)/10)*10
						this.listData[index].taskPsnAttentionId = resTask.data.list[currentIndex].taskPsnAttentionId
					}
					this.$set(this.listData[index],'isTaskPsnAttention',!this.listData[index].isTaskPsnAttention)
				}
			},
			//修改文件夹
			async handleChange(id){
				this.textValue = '修改'
				this.newShow = true
				this.overlayShow = false
				this.jobId = id
			},
			//新建文件夹
			async handleNew(id){
				this.textValue = '新建'
				this.newShow = true
				this.overlayShow = false
			},
			async handleConfirm(){
				let data,res
				if(uni.$u.test.isEmpty(this.jobValue)){
					uni.$u.toast('文件夹名字不能为空')
					this.newShow = false
					return
				}
				switch (this.textValue){
					case '修改':
						data = {
							name:this.jobValue,
							id:this.jobId
						}
						res = await editFolder(data)
						break;
					case '新建':
						data = {name:this.jobValue}
						res = await addFolder(data)
						break;
				}
				this.init()
				// uni.$u.toast(res.msg)
				this.newShow = false
				this.jobValue = ''
			},
			//移动文件夹
			async handleMove(type,sourceId,item,index){
				let targetId
				type == 'up' ? targetId = item[index-1].id : targetId = item[index+1].id
				const data = {
					sourceFolderId:sourceId,
					targetFolderId:targetId
				}
				const res = await moveFolder(data)
				this.overlayShow = false
				
				this.jobJacketList[1].jacketList[index].popShow = false
				uni.$u.toast(res.msg)
				let temp = this.jobJacketList[1].jacketList[index];
				if(type == 'up'){//上移
					if(this.oldIndex == 1 && this.oldIndexs == index) this.oldIndexs = this.oldIndexs - 1 
					this.$set(this.jobJacketList[1].jacketList,index,this.jobJacketList[1].jacketList[index-1])
					this.$set(this.jobJacketList[1].jacketList,index-1,temp)
				}else{
					if(this.oldIndex == 1 && this.oldIndexs == index) this.oldIndexs = this.oldIndexs + 1
					this.$set(this.jobJacketList[1].jacketList,index,this.jobJacketList[1].jacketList[index+1])
					this.$set(this.jobJacketList[1].jacketList,index+1,temp)
				}
				// this.init()
			},
			//删除文件夹
			handleDeleteJob(id){
				this.deleteId = id
				this.deleteShow = true
				this.jobShow = false
				this.overlayShow = false
				
			},
			async hendleDelete(){
				const res = await removeFolder(this.deleteId)
				this.deleteShow = false
				uni.$u.toast(res.msg)
				this.init()
			},
			close() {
				this.show = false
				// console.log('close');
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
			async handeRemove(){
				const id = this.listData[this.index].id
				const res = await cancelTaskType(id)
				uni.$u.toast(res.msg)
				this.show = false
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
	justify-content: space-around;
	align-items: center;
	width: 100%;
	padding: 0 16rpx;
	box-sizing: border-box;
	.uni-select__input-text{
		width: 130rpx;
		font-size: 24rpx
	}
	.search-box {
			width: 33.3%; 
			// margin: 0 20rpx;
	}
	.uni-select {
		border: none;
		border-bottom: none;
	}
}
::v-deep .uni-data-checklist .checklist-group{
	display: block;
	.checklist-box{
		margin: 20rpx 0;
	}
}
::v-deep .u-navbar__content__title{
	font-size: 24rpx !important;
}
::v-deep .u-search{
	padding: 0 20rpx;
}
.taskBox{
	padding: 20rpx;
	&_top{
		font-size: 36rpx;
		font-weight: bold;
	}
	&_text{
		color: #026DFF;
		font-weight: bold;
		padding-bottom: 10rpx;
		border-bottom: 2rpx dashed #4a4a4a;
	}
	&_radio{
		margin: 30rpx 0;
		.u-radio{
			margin-bottom: 20rpx !important;
		}
	}
	&_btn{
		display: flex;
	}
}
.content{
	padding: 0;
	padding-bottom: 20rpx;
	padding-top: calc(var(--status-bar-height) + 140rpx);
	&_status{
		display: flex;
		font-size: 28rpx;
		margin-top: 20rpx;
		&_list{
			font-weight: 500;
		}
	}
}
.content_right{
	padding-top: calc(var(--status-bar-height) + 88rpx);
	width: 540rpx;
	box-sizing: border-box;
	&_box{
		color: #333333;
		&_checked{
			background-color: #F4F4F4;
		}
		&_title{
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			padding: 0 20rpx;
		}
		&_task{
			position: relative;
			padding: 0 20rpx;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			padding: 0 47rpx 0 19rpx;
			height: 60rpx;
			line-height: 60rpx;
			margin-bottom: 20rpx;
			&_symbol{
				font-weight: bold;
				color: #CCCCCC;
				font-size: 48rpx;
				margin-left: 12rpx;
			}
			&_handle{
				width: 198rpx;
				margin-top: -2px;
				margin-top: 2px solid #FFF ;
				position: absolute;
				text-align: center;
				right: 0rpx;
				z-index: 10076;
				background-color: #fff;
				top: 35px;
				view{
					height: 60rpx;
					line-height: 60rpx;
				}
			}
			
			&_handle:after{
				position: absolute;
				top: -20px;
				left: 60px;
				content: '';
				width: 0;
				height: 0;
				border-style: dashed dashed solid dashed;
				border-width: 10px;
				border-color: transparent transparent #F8FAFC transparent;
			}
			span{
				color: #999;
				font-size: 24rpx
			}
		}
	}
	&_add{
		color: #026DFF;
		font-style: 26rpx;
		text-align: center;
		width: 100%;
		bottom: 30rpx;
		position: absolute;
	}
	image{
		width: 26rpx;
		margin-right: 23rpx;
	}
}
.new{
	width: 700rpx;
	height: 376rpx;
	padding: 40rpx 40rpx 0;
	box-sizing: border-box;
	&_text{
		font-size: 30rpx;
		text-align: center;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	button{
		margin: 70rpx auto 0;
		width: 220rpx;
		height: 76rpx;
		line-height: 76rpx;
		text-align: center;
		font-size: 32rpx;
		background-color: #026DFF;
		color: #fff;
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
			image{
				width: 27rpx;
				height: 24rpx;
				margin-left: 42rpx;
			}
		}
		
		image{
			width: 25rpx;
		}
	}
}
::v-deep .u-button{
	margin: auto !important;
	width: 200rpx !important;
	height: 70rpx !important;
}

</style>
