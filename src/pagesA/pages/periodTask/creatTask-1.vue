<template>
	<view class="creaTask-1 content">
		<u-form :model="form" ref="uForm" :errorType="errorType" label-width='80' :border-bottom='false'
			label-position='left'>
			<view class="creaTask-base">
				<view class="creaTask-title">基础信息</view>
				<u-form-item label="任务类型" prop='tackTypeName' :required="true" @click="handleAccess('taskType')">
					<view class="uni-list-cell-db">
						<u-input v-model="form.tackTypeName" placeholder="请选择任务类型" disabled disabledColor='#ffffff'
							type='textarea' border='false' :auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>
				<u-form-item label="任务名称" prop='name' :required="true">
					<u-input v-model="form.name" placeholder="请输入任务名称" type='textarea' border='false'
						:auto-height='true' maxlength='1000' />
				</u-form-item>

				<u-calendar :show="dateShow" @confirm="canlendarConfirm"></u-calendar>
			</view>

			<view class="creaTask-base">
				<view class="creaTask-title">执行人员</view>
				<u-form-item label="负责人" :required="true" @click="checkboxShow = true" prop='principalName'>
					<u-input v-model="form.principalName" placeholder="请选择负责人" disabled disabledColor='#ffffff'
						type='textarea' border='false' :auto-height='true' maxlength='1000' />
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>

				<u-form-item label="审核人" class="noBorder" :required="true" @click="radioShow = true"
					prop='veriftPenName'>
					<view class="uni-list-cell-db">
						<u-input v-model="form.veriftPenName" placeholder="请选择审核人" disabled disabledColor='#ffffff'
							type='textarea' border='false' :auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>
			</view>

			<view class="creaTask-base">
				<view class="creaTask-title">其他信息</view>
				<u-form-item label="紧急程度" :required="true" prop='urgency'>

					<u-radio-group v-model="form.urgency" placement="row">
						<u-radio :customStyle="{marginRight: '12px'}" v-for="(item, index) in list" :key="item.id"
							:label="item.name" :name="item.id" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="任务夹" class="noBorder" :required="true" @click="handleAccess('access')"
					prop='folderName'>
					<view class="uni-list-cell-db">
						<u-input v-model="form.folderName" placeholder="请选择任务夹" disabled disabledColor='#ffffff'
							type='textarea' border='false' :auto-height='true' maxlength='1000' />
					</view>
					<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18"></u-icon>
				</u-form-item>

			</view>
			<view class="creaTask-base">
				<view class="creaTask-title">任务内容</view>
				<view class="uni-textarea" v-show="!videoFlag">
					<textarea v-model="form.taskContent" placeholder='任务内容(选填)' />
				</view>
			</view>
			<view class="creaTask-base">
				<view class="creaTask-title">
					<uni-file-picker limit="10" file-mediatype="all" title="最多文件10个，单个文件不能超过500MB" @select="select"
						@success="success" v-model="fileLists" @delete="del" @videoFlag="videoflag"></uni-file-picker>
				</view>


			</view>
		</u-form>
		<u-picker :show="accessShow" :columns="accessColumns" keyName="name" @cancel="accessShow = false"
			@confirm="pickerConfirm"></u-picker>
		<u-button type="primary" class='next' text="下一步" @click='next'></u-button>

		<crewRadio :radioShow.sync='radioShow' @handleRadio="handleRadio"></crewRadio>
		<crewCheckbox :checkboxShow.sync='checkboxShow' @handleCheckbox="handleCheckbox"></crewCheckbox>
	</view>
</template>

<script>
	import {
		orgList,
		getListByAccess,
		getAndExpr
	} from "@/api/pagesA/draftBox"
	import crewRadio from "@/components/crew-radio/crew-radio.vue"
	import crewCheckbox from "@/components/crew-checkbox/crew-checkbox.vue"
	export default {
		components: {
			crewRadio,
			crewCheckbox
		},
		data() {
			return {
				videoFlag:false,
				radioShow: false,
				checkboxShow: false,
				fileLists: [],
				show: false,
				dateShow: false,
				accessShow: false,
				errorType: 'toast',
				form: {
					name: '',
					taskTypeId: '',
					tackTypeName: '',
					fileIds: [],
					principalName: '',
					parentId: 0,
					principalIds: [],
					veriftPsnId: '',
					veriftPsnName: '',
					urgency: 2,
					folderId: '',
					taskContent: '',

				},
				accessColumns: [],
				value: 'orange',
				list: [{
						name: '普通',
						disabled: false,
						id: 2
					},
					{
						name: '加急',
						disabled: false,
						id: 1
					},
					{
						name: '特急',
						disabled: false,
						id: 0
					}
				],
				rules: {
					name: [{
						required: true,
						message: '请输入姓名'
					}],
					tackTypeName: [{
						required: true,
						message: '请选择任务类型'
					}],

					principalName: [{
						required: true,
						message: '请选择负责人'
					}],
					veriftPsnName: [{
						required: true,
						message: '请选择审核人'
					}],
					urgency: [{
						required: true,
						message: '请选择紧急程度'
					}],
					folderName: [{
						required: true,
						message: '请选择任务夹'
					}],
				},
				fromData: {
					expr: [{
							expression: "EQ",
							key: "personTypeId",
							value: "1537352730808516610"
						},
						{
							expression: "EQ",
							key: "valid",
							value: true
						}
					],
					ids: [],
					page: 1,
					size: 10
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			this.init()
		},
		methods: {
			videoflag(e){
				console.log("videoFlag-------",e)
				this.videoFlag = e
			},
			async init() {
				const resOrg = await orgList()
				this.taskTypeData = resOrg.data
				const resAccess = await getListByAccess({
					access: 0
				})
				this.accessData = resAccess.data
				const resAndExpr = await getAndExpr(this.fromData)
				this.andExprData = resAndExpr.data.list
				this.$set(this.form, 'tackTypeName', resOrg.data[0].name)
				this.$set(this.form, 'tackTypeId', resOrg.data[0].id)

				const arr = this.accessData.filter(i => i.name == '日度计划')
				this.$set(this.form, 'folderName', arr[0].name)
				this.$set(this.form, 'folderId', arr[0].id)

				const info = uni.getStorageSync('info')
				this.$set(this.form, 'veriftPenName', info.personName)
				this.$set(this.form, 'veriftPsnId', info.personId)
			},
			handleAccess(dataType) {
				this.pickerType = dataType
				if (dataType == 'crew1' || dataType == 'crew2') dataType = 'crew'
				switch (dataType) {
					//审核人，负责人
					case 'crew':
						this.$set(this.accessColumns, 0, this.andExprData)
						break;
						//任务夹
					case 'access':
						this.$set(this.accessColumns, 0, this.accessData)
						break;
						//任务类型
					case 'taskType':
						this.$set(this.accessColumns, 0, this.taskTypeData)
						break;
				}
				this.accessShow = true
				console.log("this.accessColumns", this.accessColumns)
			},
			async handleIssue() {
				console.log('2222', this.form)
				// const res = await addTask(this.form)
				// console.log(res)
				this.$refs.uForm.validate().then(res => {
					for (let item of this.fileLists) {
						this.form.fileIds.push(item.id)
					}
					let formJson = JSON.stringify(this.form)
					uni.navigateTo({
						url: `/pagesA/pages/periodTask/creatTask-2?formJson=${formJson}`

					})
				}).catch(errore => {
					console.log('333', errore)
					console.log('验证失败');
					// uni.$u.toast('校验失败')
				})
			},
			// 选中某个单选框时，由radio时触发
			pickerConfirm(e) {
				console.log(e);
				switch (this.pickerType) {
					case 'crew1':
						this.form.principalName = e.value[0].name
						this.form.principalIds.push(e.value[0].id)
						break;
					case 'crew2':
						this.form.veriftPenName = e.value[0].name
						this.form.veriftPsnId = e.value[0].id
						break;
					case 'access':
						this.form.folderName = e.value[0].name
						this.form.folderId = e.value[0].id
						break;
					case 'taskType':
						this.form.tackTypeName = e.value[0].name
						this.form.taskTypeId = e.value[0].id
						break;
				}
				this.accessShow = false
			},
			canlendarConfirm(e) {

				this.dateShow = false
			},
			// 选中任一radio时，由radio-group触发
			radioChange(e) {
				this.form.urgency = e.detail.value

			},
			next() {
				console.log("this1111111111", this.form)
				this.handleIssue()
			},
			// 文件上传成功
			success(val) {
				console.log("val111111", val)
			},
			async	select(val){
				console.log(val)
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

			del(val) {
				console.log("val111", val)
				for (let index in this.fileLists) {
					if (this.fileLists[index].uuid == val.tempFile.uuid) {
						this.fileLists.splice(index, 1)
					}
				}
				console.log("this.fileLists", this.fileLists)
			},
			handleRadio(e) {
				this.form.veriftPenName = e.radioName
				this.form.veriftPsnId = e.radioValue
			},
			handleCheckbox(e) {
				this.form.principalIds = [...e.checkboxValue]
				this.form.principalName = [...e.checkboxName].join()
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-button {
		margin: auto !important;
		width: 200rpx !important;
		height: 70rpx !important;


	}

	::v-deep .uni-list-cell-db {
		.u-input {
			height: 35px !important;
			line-height: 35px !important;
			padding-top: 0 !important;

		}
	}

	.next {
		display: flex;
		justify-content: space-between;
		padding: 0 119rpx;

		button {
			width: 220rpx;
			height: 76rpx;
			line-height: 76rpx;
			font-size: 32rpx;
		}
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
			font-size: 32rpx;
			font-weight: 600;
			margin-bottom: 16rpx;

			.u-button {
				width: 200rpx;
				height: 70rpx;
			}
		}
	}

	::v-deep .u-form-item__body {
		align-items: flex-start;
		border-bottom: 1rpx solid #DCDCDC;
		padding: 0;
		height: 80rpx;
		margin-top: 8rpx
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
	
	::v-deep .uni-textarea{
		textarea{
			z-index: 10;
		}
	}
</style>
