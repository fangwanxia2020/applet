<template>
		<view class="search">
		<view class="searchBox">
			<input class="uni-input" type="text" name="" id="" placeholder="请输入任务名称">
			<view class="uni-input-btn">搜索</view>
		</view>
		</view>

</template>

<script>
</script>

<style lang="scss" scoped>
.search{
	width: 100%;
	height: 70rpx;
	margin-bottom: 16rpx;
	box-sizing: border-box;
}
.searchBox{
	position: relative;
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
}
.uni-input {
	position: absolute;
	left: 0rpx;
	height: 70rpx;
	padding: 15rpx 25rpx;
	line-height:50rpx;
	font-size:28rpx;
	background:#FFF;
	width: 100%;
	border-radius: 14rpx;

}
.uni-input-btn{
	border-radius: 20rpx;
	position: absolute;
	height: 60rpx;
	width: 60rpx;
	background-color: #598DEE;
	color: #fff;
	padding: 0 15rpx;
	right: 0rpx;
	text-align: center;
	line-height: 60rpx;
	top: 5rpx;
}
	
</style>
