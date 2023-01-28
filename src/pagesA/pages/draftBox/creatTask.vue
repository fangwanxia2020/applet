<template>
	<view class="creaTask-1 content">
		<u-form :model="form" ref="taskForm" :errorType="errorType" label-width='80' :border-bottom='false' label-position='left' >
			<view class="creaTask-base">
				<view class="creaTask-title">基础信息</view>
				
				<u-form-item label="任务类型"  prop='tackTypeId' :required="true" @click="handleAccess('taskType')">
					<view class="uni-list-cell-db">
						<u-input v-model="form.tackTypeName" fontSize="13px" placeholder="请选择任务类型" disabled disabledColor='#ffffff' type='textarea' border='false'
							:auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>
				
				<u-form-item label="任务名称" prop='name'  :required="true">
					<u-input v-model="form.name" fontSize="13px" placeholder="请输入任务名称" type='textarea' border='false'
						:auto-height='true' maxlength='1000' />
				</u-form-item>
				
				<u-form-item label="截止时间" prop='deadlineTime' class="noBorder" :required="true"  @click="dateShow = true">
					<u-input v-model="form.deadlineTime" fontSize="13px" placeholder="请选择截止时间" disabled disabledColor='#ffffff' type='textarea' border='false'
						:auto-height='true' maxlength='1000' />
					<u-icon name="clock" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>
				<u-datetime-picker
					:show="dateShow"
					:minDate="currentDate"
					v-model="deadlineTime"
					mode="datetime"
					@confirm="dateShow = false"
				></u-datetime-picker>
			</view>
			
			<view class="creaTask-base">
				<view class="creaTask-title">执行人员</view>
				<u-form-item label="负责人"  prop='personName' :required="true" @click="checkboxShow = true">
					<u-input v-model="form.personName" fontSize="13px" placeholder="请选择负责人" disabled disabledColor='#ffffff' type='textarea' border='false'
						:auto-height='true' maxlength='1000' />
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" ></u-icon>
				</u-form-item>
				
				<u-form-item label="审核人" prop='veriftPen' class="noBorder" :required="true" @click="radioShow = true">
					<view class="uni-list-cell-db">
						<u-input v-model="form.veriftPen" fontSize="13px" placeholder="请选择审核人" disabled disabledColor='#ffffff' type='textarea' border='false'
							:auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" ></u-icon>
				</u-form-item>
			</view>
			
			<view class="creaTask-base">
				<view class="creaTask-title">其他信息</view>
				<u-form-item label="紧急程度"  prop='urgency'  :required="true">
					 <u-radio-group
					    v-model="form.urgency"
					    placement="row"
					  >
					    <u-radio
					      :customStyle="{marginRight: '12px'}"
					      v-for="(item, index) in list"
					      :key="item.id"
					      :label="item.name"
					      :name="item.id"
					      @change="radioChange"
					    >
					    </u-radio>
					  </u-radio-group>
				</u-form-item>
				
				<u-form-item label="任务夹"  prop='createFolderName' class="noBorder" :required="true" @click="handleAccess('access')">
					<view class="uni-list-cell-db">
						<u-input v-model="form.createFolderName" fontSize="13px" placeholder="请选择任务夹" disabled disabledColor='#ffffff' type='textarea' border='false'
							:auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>
				
			</view>
			<view class="creaTask-base">
				<view class="creaTask-title">任务内容</view>
				<view class="uni-textarea" v-show="!videoFlag">
					<textarea v-model="form.taskContent" fontSize="13px" placeholder='任务内容(选填)' />
				</view>
			</view>
			<view class="creaTask-base">
				<view class="creaTask-title">
					<uni-file-picker 
					@videoFlag="videoflag"
					limit="10" 
					file-mediatype="all"  
					title="最多文件10个，单个文件不能超过500MB"
					@select="select"
				  @success = "success"
				  v-model="fileLists"
	  			@delete="del"
					></uni-file-picker>
				</view>
			</view>
		</u-form>
		<u-picker
		 :show="accessShow" 
		 :columns="accessColumns" 
		 keyName="name"
		 @cancel="accessShow = false"
		 @confirm="pickerConfirm"
		 ></u-picker>
		<view class='next'>
			<button  @click="handleCreated">{{id?'修改':'存草稿'}}</button>
			<button style="background-color: #026DFF;" type="primary" @click="handleIssue">发布</button>
		</view>
		
		<crewRadio  :radioShow.sync='radioShow' @handleRadio="handleRadio"></crewRadio>
		<crewCheckbox  :checkboxShow.sync='checkboxShow' @handleCheckbox="handleCheckbox"></crewCheckbox>
	</view>
</template>

<script>
	import {orgList,getListByAccess,addTask,getInfoTask,editTaskType,appletsEdit,appletsRelease,listByIds} from "@/api/pagesA/draftBox"
	import crewRadio from "@/components/crew-radio/crew-radio.vue"
	import crewCheckbox from "@/components/crew-checkbox/crew-checkbox.vue"
	export default {
		components:{
			crewRadio,
			crewCheckbox
		},
		data() {
			return {
				videoFlag:false,
				fileLists: [],
				radioShow:false,
				show: false,
				dateShow:false,
				accessShow:false,
				checkboxShow:false,
				id:null,
				errorType: 'toast',
				deadlineTime:'',
				radioParentId:'', //传值给crewRadio组件
				currentDate:new Date().getTime(),
				form: {
					name: '',
					tackTypeId:'',
					deadlineTime:'',
					personName:'',
					parentId:0,
					personIds:[],
					veriftPenId:'',
					urgency:2,
					fileIds:[],
					createFolderId:'',
					taskContent:'',
				},
				accessColumns:[],
				value: 'orange',
				list: [{
						name: '普通',
						id:2
					},
					{
						name: '加急',
						id:1
					},
					{
						name: '特急',
						id:0
					}
				],
				rules: {
					name: [{
						required: true,
						message: '请输入任务名称'
					}],
					tackTypeId:[{
						required: true,
						message: '请选择任务类型'
					}],
					deadlineTime:[{
						required: true,
						message: '请选择截止时间'
					}],
					personName:[{
						required: true,
						message: '请选择负责人'
					}],
					veriftPen:[{
						required: true,
						message: '请选择审核人'
					}],
					urgency:[{
						required: true,
						message: '请选择紧急程度'
					}],
					createFolderName:[{
						required: true,
						message: '请选择任务夹'
					}],
				},
			}
		},
		onReady(){
			this.$refs.taskForm.setRules(this.rules);
		},
		watch:{
			deadlineTime(val){
				this.form.deadlineTime =  uni.$u.timeFormat(val, 'yyyy-mm-dd hh:MM')
			}
		},
		async onLoad(options) {
			const {id} = options
			this.id = id
			if(id){
				const res = await getInfoTask(id)
				let {name,tackTypeName,tackTypeId,deadlineTime,urgency,taskContent,parentId,personIds,personName,veriftPen,veriftPenId,createFolderId,createFolderName} = res.data
				deadlineTime = deadlineTime.substring(0, 16)
				this.form = {name,tackTypeName,tackTypeId,deadlineTime,urgency,parentId,taskContent,veriftPen,veriftPenId,personIds,personName,createFolderId,createFolderName}
				this.form.fileIds = []
				if(res.data.fileIds){
					const fileIdLists = await listByIds(res.data.fileIds)
					fileIdLists.data.map((item) => {
						this.fileLists.push({
							res: {
								...item,
							},
							name: item.name,
							id: item.id,
							extname: item.name.split('.')[1],
							url: item.downloadUrl,
						});
					});
				}
			}
			await this.init()
			
		},
		methods: {
			videoflag(e){
				console.log("videoFlag-------",e)
				this.videoFlag = e
			},
			async init(){
				const resOrg = await orgList()
				this.taskTypeData = resOrg.data
				const resAccess = await getListByAccess({access:0 })
				this.accessData = resAccess.data
				if(!this.id){
					this.$set(this.form,'tackTypeName',resOrg.data[0].name)
					this.$set(this.form,'tackTypeId',resOrg.data[0].id)
					
					const arr = this.accessData.filter(i=> i.name == '日度计划')
					this.$set(this.form,'createFolderName',arr[0].name)
					this.$set(this.form,'createFolderId',arr[0].id)
					
					const info = uni.getStorageSync('info')
					this.$set(this.form,'veriftPen',info.personName)
					this.$set(this.form,'veriftPenId',info.personId)
				}
			},
			
			handleAccess(dataType){
				this.pickerType = dataType
				switch (dataType){
					//任务夹
					case 'access':
						this.$set(this.accessColumns,0,this.accessData)
						break;
					//任务类型
					case 'taskType':
						this.$set(this.accessColumns,0,this.taskTypeData)
						break;
				}
				this.accessShow = true
			},
			//存草稿
			handleCreated(){
				console.log(this.form)
				this.$refs.taskForm.validate().then(async res => {
					let res1
					if(this.form.deadlineTime.length == 16)this.form.deadlineTime = this.form.deadlineTime + ':00'
					for( let item of this.fileLists){
						this.form.fileIds.push(item.id)
					}
					if(this.id){
						this.form.id = this.id
						res1 = await editTaskType(this.form)
					}else{
						res1 = await addTask(this.form)
					}
					uni.navigateBack(1)
				}).catch(errors => {
					// uni.$u.toast('校验失败')	
				})
				
			},
			//发布
			async handleIssue(){
				this.$refs.taskForm.validate().then(async res => {
					let res1
					if(this.form.deadlineTime.length == 16)this.form.deadlineTime = this.form.deadlineTime + ':00'
					for( let item of this.fileLists){
						this.form.fileIds.push(item.id)
					}
					if(this.id){
						this.form.id = this.id
						res1 = await appletsEdit(this.form)
					}else{
						res1 = await appletsRelease(this.form)
					}
					uni.navigateBack(1)
				})
			},
			success(val){
					console.log("val111111",val)
				},
			async	select(val){
				console.log(val)
				for (let index in val.tempFiles) {
					console.log()
					let exName = val.tempFiles[index].extname
					await	uni.uploadFile({
						url: process.env.VUE_APP_BASE_API + '/api/sysfile/file_info/upload',
						filePath: val.tempFilePaths[index],
						name: 'file',
						formData: {
							'user': 'test'
						},
						success: (uploadFileRes) => {
							console.log("uploadFileRes",uploadFileRes)
							let res = JSON.parse(uploadFileRes.data)
							console.log("res",res)
							let obj = {
								id:res.data.id,
								filePath:res.data.filePath,
								downloadUrl:res.data.downloadUrl,
								name: res.data.name,
								extname: exName
							}
							this.fileLists.push(obj)
						}
					})
				}
			},
			del(val){
				for (let i = this.fileLists.length-1; i > 0; i--) {
					if(this.fileLists[i].id == val.tempFile.id){
						this.fileLists.splice(i,1)
						break;
					}
				}
			},

			handleRadio(e){
				this.form.veriftPen = e.radioName
				this.form.veriftPenId = e.radioValue
			},
			handleCheckbox(e){
				this.form.personIds = [...e.checkboxValue]
				this.form.personName = [...e.checkboxName].join()
			},
			// 选中某个单选框时，由radio时触发
			pickerConfirm(e) {
				console.log(e);
				switch (this.pickerType){
					case 'access':
						this.form.createFolderName = e.value[0].name
						this.form.createFolderId = e.value[0].id
						break;
					case 'taskType':
						this.form.tackTypeName = e.value[0].name 
						this.form.tackTypeId = e.value[0].id 
						break;
				}
				this.accessShow = false
			},
			// 选中任一radio时，由radio-group触发
			radioChange(e) {
				this.form.urgency = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .next {
		.u-button {
			margin: auto !important;
			width: 200rpx !important;
			height: 70rpx !important;
		}



	}

	::v-deep .uni-list-cell-db {
		.u-input {
			height: 35px !important;
			line-height: 35px !important;
			padding-top: 0 !important;

		}
	}
	.crew{
		padding: 20rpx;
		&_text{
			color: #026DFF;
			font-weight: bold;
			font-size: 36rpx;
			padding-bottom: 10rpx;
		}
		&_radio{
			margin: 30rpx 0;
			.u-radio{
				margin-bottom: 20rpx !important;
			}
		}
		&_btn{
			margin-top: 40rpx;
			display: flex;
			justify-content: space-around;
			.confirm{
				background: #026DFF;
				color: #fff;
			}
			button{
				width: 160rpx;
				font-size: 28rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}
	.next {
		display: flex;	
		justify-content: space-between;
		padding: 0 119rpx;
		button{
			width: 220rpx;
			height: 76rpx ;
			line-height: 76rpx;
			font-size: 32rpx;
		}
	}
::v-deep .uni-button{
	background-color: #026DFF;
}
	::v-deep .creaTask-base {
		background-color: #FFFFFF;
		box-sizing: border-box;
		width: 100%;
		padding: 16rpx 40rpx;

		border-radius: 10rpx;
		margin-bottom: 20rpx;

		.tips {
			color: rgb(192, 196, 204);
		}

		.creaTask-title {
			font-size: 26rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 16rpx;

			.u-button {
				width: 200rpx;
				height: 70rpx;
			}
		}
	}

	::v-deep .u-form-item__body {
		align-items: flex-start;
		border-bottom: 1rpx solid #DCDCDC ;
		padding: 0;
		height: 80rpx;
		margin-top: 8rpx;
	}

	::v-deep .noBorder {
		.u-form-item__body {
			border-bottom: 0;
		}

	}

	::v-deep .u-form-item__body__left__content {
		font-size: 32rpx;
		color: #333;
		line-height: 70rpx;
		height: 70rpx;
	}

	::v-deep .u-input__content {
		line-height: 70rpx;
		height: 70rpx;

	}

	::v-deep .u-form-item__body__right__content__slot {
		flex-direction: row;
		height: 70rpx;
	}

	::v-deep radio-group,
	checkbox-group {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
