<template>
	<view class="content">
		<u-textarea v-model="editData.context" confirmType="done" placeholder="请输入更新说明" ></u-textarea>
		<view class="creaTask-base">
			<view class="creaTask-title">
				<uni-file-picker
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
		<view class="slideBox">
			<view class="">
				更新进度
			</view>
			<u-slider v-model="editData.taskProgress">
			</u-slider>
			<span>{{editData.taskProgress}}</span>
		</view>
		<view class='next'>
			<button class="next-btn" type="primary" @click="hendleSave()">保存并提交审批</button>
			<button @click="hendleUpdate()">更新进度</button>
		</view>
	</view>
</template>

<script>
	import {updateProgress,getTaskProgress,respCommitRec} from "@/api/pages/jobJacket"
	import {getSupportingInformation,fileInfo} from "@/api/pagesA/havePublished"
	export default{
		data(){
			return{
				fileLists:[],
				editData:{
					context:'',
					taskProgress:0
				},
			}
		},
		async onLoad(options) {
			const {id,selectPersonType} = options
			this.id = id
			const progress = await getTaskProgress(id)
			this.editData.taskProgress = progress.data
			this.getSupportingInformation(id,selectPersonType)
		},
		methods:{
			async hendleUpdate(){
				let fileIdList = []
				if(this.fileLists){
						this.fileLists.map(i=>{
						fileIdList.push(i.id)
				 })
				}
				let data = {
					...this.editData,
					fileIdList,
					taskId:this.id
				}
				const res = await updateProgress(data)
				uni.$u.toast(res.msg)
				setTimeout(()=>{
					uni.navigateBack(1)
				},1000)
			},
			success(val){
					console.log("val111111",val)
				},
			async	select(val){
				// this.fileLists = val.tempFiles
				for (let index in val.tempFiles) {
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
				console.log("val111",val)
				for (let i = this.fileLists.length-1; i > 0; i--) {
					if(this.fileLists[i].id == val.tempFile.id){
						this.fileLists.splice(i,1)
						break;
					}
				}
			},
			getSupportingInformation(id,selectPersonType){
				console.log(324)
				let data = { taskId:id ,selectPersonType:selectPersonType}
				getSupportingInformation(data).then(response => {
					if(response.data.fileIdList != null && response.data.fileIdList.length != 0){
						this.getFile(response.data.fileIdList)
					}
				});
			},
			async getFile(fileIds) {
				const info = await fileInfo(fileIds)
				info.data.map((item) => {
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
			},
			hendleSave(){
				if(this.editData.taskProgress != 100){
					uni.$u.toast('请更新进度至100%才能提交审批！')
					return
				}
				let fileIdList = []
				if(this.fileLists){
						this.fileLists.map(i=>{
						fileIdList.push(i.id)
				 })
				}
				let data = {
					...this.editData,
					fileIdList,
					taskId:this.id
				}
				updateProgress(data).then(res =>{
					const commiData = {
						taskId:this.id,
						commit:5
					}
					return respCommitRec(commiData)
				}).then( respCommi=>{
						uni.$u.toast(respCommi.msg)
						setTimeout(()=>{
							uni.navigateBack(1)
						},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slideBox{
		background-color: #fff;
		display: flex;
		align-items: center;
		color: #333;
		font-size: 30rpx;
		font-weight: bold;
		padding: 10rpx 40rpx;
		::v-deep .u-slider{
			width: 60%;
		}
	}
	.next {
		display: flex;	
		justify-content: space-between;
		padding: 0 119rpx;
		margin-top: 30rpx;
		.next-btn{
			background: #026DFF;
		}
		button{
			width: 220rpx;
			height: 76rpx ;
			line-height: 76rpx;
			font-size: 32rpx;
		}
	}
	::v-deep .creaTask-base {
		background-color: #FFFFFF;
		box-sizing: border-box;
		width: 100%;
		padding: 16rpx 40rpx;
		margin-top: 20rpx;
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
</style>