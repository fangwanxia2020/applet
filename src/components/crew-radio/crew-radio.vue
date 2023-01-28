<template>
	<view class="">
		<u-popup :show.sync="radioShow" @close="$emit('update:radioShow', false)">
				<view class="crew">
					<view class="crew_text">
						选择人员
					</view>
					<view class="crew_radio">
						<u-radio-group
								v-model="radioValue"
								placement="column"
							>
								<u-radio
									:customStyle="{marginBottom: '8px'}"
									v-for="(item, index) in andExprData"
									:key="item.id"
									:label="item.name"
									:name="item.id"
									@change="changeRadio(item.name)"
								>
								</u-radio>
							</u-radio-group>
						</view>
						<uni-pagination :current="fromData.page"  :total="crewTotal" title="标题文字"  @change="changePage" />
						<view class="crew_btn">
							<button class="cancel" @click="$emit('update:radioShow',false)">取消</button>
							<button class="confirm" @click="handleRadio">完成</button>
						</view>
				</view>
			</u-popup>
	</view>
</template>

<script>
	import {getAndExpr} from "@/api/pagesA/draftBox"
	export default{
		name:'crewRadio',
		props: {
			radioShow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				andExprData:[],
				crewTotal:20,
				radioValue:'',
				fromData:{
					expr:[{
						expression: "EQ",
						key: "personTypeId",
						value: "1537352730808516610"
					},
					{
						expression: "EQ",
						key: "valid",
						value: true
					}],
					ids: [],
					page: 1,
					size: 10
				},
			}
		},
		created() {
			this.getAndExpr()
		},
		methods:{
			async getAndExpr(){
				const resAndExpr = await getAndExpr(this.fromData)
				this.andExprData = resAndExpr.data.list
				this.crewTotal = resAndExpr.data.pagination.total
			},
			changePage(e){
				this.fromData.page = e.current
				this.getAndExpr()
			},
			changeRadio(e){
				this.transientName = e
			},
			handleRadio(){
				const {transientName,radioValue} = this
				const obj = {
					radioName:transientName,
					radioValue
				}
				this.$emit('update:radioShow', false)
				this.$emit("handleRadio", obj);
			}
			
		}
	}
</script>

<style lang="scss" scoped>
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
</style>