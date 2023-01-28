<script>
	export default {
		name: 'App'
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./common/styles/uni.css";
	/* 自定义公共css */
	@import "./common/styles/common.css";

	page {
		background-color: $uni-bg-color; // 全局背景颜色
	}
</style>
