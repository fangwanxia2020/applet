<template>
	<view class="">
		<u-popup :show.sync="checkboxShow" @close="$emit('update:checkboxShow', false)">
				<view class="crew">
					<view class="crew_text">
						选择人员
					</view>
					<view class="crew_radio">
						<u-checkbox-group
								v-model="radioValue"
								placement="column"
								@change="checkboxChange"
							>
								<u-checkbox
									:customStyle="{marginBottom: '8px'}"
									v-for="item in andExprData"
									:key="item.id"
									:label="item.name"
									:name="item.id"
								>
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<uni-pagination :current="fromData.page" :total="crewTotal" title="标题文字"  @change="changePage" />
						<view class="crew_btn">
							<button class="cancel" @click="$emit('update:checkboxShow',false)">取消</button>
							<button class="confirm" @click="handleCheckbox">完成</button>
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
			checkboxShow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				andExprData:[],
				temporaryArr:[],
				crewTotal:20,
				radioValue:[],
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
				this.temporaryArr.map((i) =>{
					this.radioValue = [...this.radioValue,...i.valueArr]
				})
				this.fromData.page = e.current
				this.getAndExpr()
			},
			checkboxChange(e){
				let nameArr = []
				if(e.length){
					this.andExprData.filter(item=>{
						return e.includes(item.id)
					})
					.map((i) =>{
						nameArr.push(i.name)
					})
				}
				//判断当前页是否存在数据
				const filterData = this.temporaryArr.filter((i) => i.page == this.fromData.page)
				if(!filterData.length){
					this.temporaryArr.push({
						page: this.fromData.page,
						valueArr:e,
						nameArr
					})
				}else{
					filterData[0].valueArr = e
					filterData[0].nameArr = nameArr
				}
			},
			handleCheckbox(){
				let obj = {
					checkboxName:[],
					checkboxValue:[]
				}
				this.temporaryArr.map(i=>{
					obj.checkboxName = [...obj.checkboxName,...i.nameArr]
					obj.checkboxValue = [...obj.checkboxValue,...i.valueArr]
				})
				this.$emit('update:checkboxShow', false)
				this.$emit("handleCheckbox", obj);
				console.log("obj",obj)
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