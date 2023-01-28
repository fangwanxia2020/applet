<template>
	<view>
		<view class="list-adjunct-list" v-for="(item,index) in fileLists" :key='index'>
			<image :src="file" mode="widthFix"></image>
			<span class="list-adjunct-list-one">{{item.name}}</span>
			<view class="list-adjunct-list-two">
				<span class="size">{{(item.fileSize/1000).toFixed(2)}}kb</span>
				<span class="preview" @click="yulan(item)">预览</span>
				<span class="down" @click="download(item)">下载</span>
			</view>
		</view>
		<view class="preview-full" v-if="videoFlag!=''">
			<video id='myVideo' :src='src' autoplay='true' @play="playVedio()" objectFit="fill"
				@fullscreenchange="fullscreenchange" ></video>
		</view>
	</view>
</template>

<script>
	import file from '@/static/images/pageA/file.png'
	export default {
		props: {
			fileLists: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
				file,
				src: '',
				videoFlag: false
			}
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo', this)
		},
		methods: {
	playVedio() {
	
				this.videoContext.requestFullScreen();
	
	
			},

	
	// 退出全屏
			fullscreenchange(e) {
				console.log("e",e)
				if (!e.detail.fullScreen) {
					this.videoContext.stop()
					this.videoFlag = false
				}
			},
		yulan(item) {
			console.log("item",item)
			let typeName = item.code.split(".")[1]
			let imgType = ['png', 'jpg', 'jpeg'];
			let fileType = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];
			let videoType =  ['avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf','flv','f4v','rmvb','rm','3gp','vob'];
			uni.showLoading({ title: '加载中' })
			if (imgType.includes(typeName)) {
				console.log("this.previewImg", this.previewImg)
				this.previewImg(item);
		
			} else if (fileType.includes(typeName)) {
				this.previewFile(item, typeName)
			}else if (videoType.includes(typeName)) {
				this.previewVideo(item)
			}
		
		
		},
			download(item) {
				uni.showLoading({ title: '加载中' })
				const filePathPrefix = wx.env.USER_DATA_PATH;
				const fullFilePath = filePathPrefix + '/' + item.name;
				const FileSystemManager = wx.getFileSystemManager();
				wx.downloadFile({
					url: process.env.VUE_APP_BASE_API + `/api/sysfile/file_info/download?id=${item.id}`,
					success: function(res) {
						let tempFilePath = res.tempFilePath
						  wx.saveFile({
								tempFilePath: tempFilePath,
								success(res) {
									console.log('wx.saveFile:success:', res.savedFilePath);
									let savedFilePath = res.savedFilePath
									FileSystemManager.saveFile({
										tempFilePath: savedFilePath, // 传入一个本地临时文件路径
										filePath: fullFilePath,
										success(res) {
											console.log('saveFile:', res); // res.savedFilePath 为一个本地缓存文件路径
										},
										fail: (res) => {
											console.log('FileSystemManager.saveFile:fail:', res)
										}
									});
								},
								fail: (res) => {
									console.log('wx.saveFile:fail:', res)
								}
							});
							uni.hideLoading();
						uni.$u.toast('下载成功')
					},
					fail: function() {
						uni.$u.toast('下载失败')
					}
				})
			},

			//预览图片
			previewImg(item) {
				console.log("111111111111")
				uni.downloadFile({
					url: process.env.VUE_APP_BASE_API + `/api/sysfile/file_info/download?id=${item.id}`,
					success: function(res) {
						uni.hideLoading();
						console.log("res", res)
						var tempFilePath = res.tempFilePath
						let array = []
						array[0] = tempFilePath
						// 预览图片
						uni.previewImage({
							urls: array,
							current: 0

						});

					},
					fail: function() {
						uni.$u.toast('预览失败')
					}
				})

			},


			//文件预览
			previewFile(item, typeName) {
				console.log("文件预览")
				uni.downloadFile({
					url: process.env.VUE_APP_BASE_API + `/api/sysfile/file_info/download?id=${item.id}`,
					success: function(res) {
					
						uni.hideLoading();
						console.log("res", res)
						var tempFilePath = res.tempFilePath
						uni.openDocument({
							filePath: tempFilePath,
							fileType: typeName, // 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx 
							// showMenu: true, // 允许出现分享功能
							success: res => {
								uni.hideLoading();
								console.log('打开文档成功', res);
							},
							fail: openError => {
								uni.hideLoading();
								console.log('fail:' + JSON.stringify(openError));
							}
						});

					},
					fail: function() {
						uni.$u.toast('预览失败')
					}
				})

			},
			//预览视频
			previewVideo(item) {
				 var self = this
			
					console.log("111111111111")
					uni.downloadFile({
						url: process.env.VUE_APP_BASE_API + `/api/sysfile/file_info/download?id=${item.id}`,
						success: function(res) {
							console.log("res", res)
							var tempFilePath = res.tempFilePath
							let array = []
							array[0] = tempFilePath
							 // 2. 将内存中的文件 下载到本地系统相册
						 // uni.saveVideoToPhotosAlbum({ filePath: tempFilePath })
						 
				 uni.hideLoading()
				 // uni.showToast({ title: '下载成功', icon: 'none' })
				 self.src = tempFilePath
				self.videoFlag = true
				 // self.videoContext.requestFullScreen();
						},
						fail: function() {
							uni.$u.toast('预览失败')
						}
					})
				
				},
		}

	}
</script>

<style lang="scss" scoped>
	.list-adjunct-list {
		display: flex;
		align-items: center;
		margin-top: 10rpx;

		.list-adjunct-list-one {
			width: 300rpx;
			margin-right: 34rpx;
			white-space: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.list-adjunct-list-two {
			.size {
				margin-right: 30rpx;
			}

			.preview {
				color: #026DFF;
				margin-right: 20rpx;
			}

			.down {
				color: #026DFF;

			}
		}
	}

	image {
		width: 22rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}
	
	.preview-full {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1002;
	}
	
	.preview-full video {
		width: 100%;
		height: 100%;
		z-index: 1002;
	}
</style>
