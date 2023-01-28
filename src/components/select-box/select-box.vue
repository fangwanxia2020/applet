<template>
	<!-- 组件整体 -->
	<view class="select_down_mDown">
		<!-- 组件头部 -->
		<view class="select_down" @click.stop="showDownMenu">
		
			<text class="select_down_text">{{value}}</text>
			<!-- 图标 -->
		<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" ></u-icon>
		</view>
		<!-- 下拉显示区域 -->
		<view class="select_down_" v-show="showMenu">
			<text class="select_down_item" v-for="(item,index) in data" :key='index' @click="item_click(item)">{{item}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				showMenu:false,
				data:[
					'ff','33'
				]
			}	
		},
		props:{
			value:{
				type:String,
				default: '#30C58D'
			},
			// data:{
			// 	type:Array
			// }
		},
		computed:{
			values:{
				get(){
					return this.value
				},
				set(val){
					this.$emit('input',val)
				}
			}
		},
		methods:{
			// 判断是否展开下拉框
			showDownMenu(){
				// 点击下拉菜单整体外关闭下拉菜单
				document.body.addEventListener('click',()=>{
					this.showMenu=false
				})
				//是否关闭 or 打开
				if(this.showMenu){
					this.showMenu=false
				}else{
					this.showMenu=true
				}
			},
			item_click(item){
				this.values=item+''
			}
		}
	}
</script>

<style scoped lang="scss">
	.select_down_mDown{
		position: relative;
		transform: translateX(-20rpx);
		.select_down{
			width: 200rpx;
			height: 72rpx;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 14rpx;
			display: flex;
			flex-direction:wrap ;
			align-items: center;
			.select_down_text{
				width:200rpx;
				height: 36rpx;
				font-size: 30rpx;
				font-family: SF UI Text;
				font-weight: 300;
				line-height: 36rpx;
				color: #333333;
				opacity: 1;
				margin-left: 0;
				padding-left: 20rpx;
			}
			.select_down_border{
				width: 7rpx;
				height: 60rpx;
				border-left: 7rpx solid #F0F0F0;
				margin-left: 0;
			}
			.select_down_image{
				width: 20rpx;
				height: 16rpx;
				margin-left: 4rpx;
			}
		}
		.select_down_{
			width: 200rpx;
			height: 600rpx;
			background: #FFFFFF;
			opacity: 1;
			margin-top: 2rpx;
			border-radius: 14rpx;
			padding-top: 10rpx;
			display: flex;
			flex-direction: column;
			overflow-x: hidden;
			.select_down_item{
				padding: 10rpx;
				font-size: 30rpx;
				color: #000;
				width: 200rpx;
				border-radius: 14rpx;
				margin-left: 26rpx;
				border-bottom: 2rpx solid #F0F0F0;
			}
			.select_down_item:hover{
				background-color: #FC603A;
			}
		}
	}
</style>
