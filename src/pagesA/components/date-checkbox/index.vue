<template>
	<view class="">
		<u-popup :show.sync="checkboxShow" @close="$emit('update:checkboxShow', false)">
				<view class="crew">
					<view class="crew_text">
						{{title}}
					</view>
					<view class="crew_radio">
						<u-checkbox-group
								v-model="radioValue"
								placement="column"
								@change="checkboxChange"
							>
								<u-checkbox
									:customStyle="{marginBottom: '8px'}"
									v-for="item in list"
									:key="item.id"
									:label="item.label"
									:name="item.id"
									:disabled = "item.id == disabledId"
								>
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<uni-pagination :current="page" :total="crewTotal" title="标题文字"  @change="changePage" />
						<view class="crew_btn">
							<button class="cancel"  @click="$emit('update:checkboxShow',false)">取消</button>
							<button class="confirm" @click="handleCheckbox">完成</button>
						</view>
				</view>
			</u-popup>
	</view>
</template>

<script>
	// import {getAndExpr} from "@/api/pagesA/draftBox"
	export default{
		name:'crewRadio',
		props: {
			checkboxShow: {
				type: Boolean,
				default: false
			},
			andExprData:{
				type:Array
			},
			title:{
				type:String
			},
			disabledId:{
				type:Number
			}
		},
		data() {
			return {
				list:[],
				temporaryArr:[],
				crewTotal:20,
				radioValue:[],
				page: 1,
				size: 10,
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
					
				},
			}
		},
		created() {
		console.log("this.andExprData111",this.andExprData)
	
	
		// this.radioValue[0] = new Date().getDate()
		},
		updated(){
			this.radioValue[0] = this.disabledId
		},
		mounted(){
			console.log("this.andExprData222",this.andExprData)
			this.crewTotal = this.andExprData.length
			this.getList()
		},
		methods:{
			// async getAndExpr(){
			// 	const resAndExpr = await getAndExpr(this.fromData)
			// 	this.andExprData = resAndExpr.data.list
			// 	this.crewTotal = resAndExpr.data.pagination.total
			// },
		getList(){
				this.list =  this.andExprData.slice((this.page-1)*this.size,(this.page-1)*this.size+this.size)
				console.log("list1111111",this.list)
		},
			changePage(e){
				console.log("this.temporaryArr3333",this.temporaryArr)
				this.temporaryArr.map((i) =>{
					this.radioValue = [...this.radioValue,...i.valueArr]
				})
				this.page = e.current
			this.getList()
			},
			checkboxChange(e){
				console.log("e",e)
		
			
				let nameArr = []
				if(e.length){
					this.andExprData.filter(item=>{
						return e.includes(item.id)
					})
					.map((i) =>{
						nameArr.push(i.label)
					})
				}
				console.log("nameArr",nameArr)
				//判断当前页是否存在数据
				const filterData = this.temporaryArr.filter((i) =>{
					return i.page == this.page
				})
				if(!filterData.length){
					console.log(1111)
					this.temporaryArr.push({
						page: this.page,
						valueArr:e,
						nameArr
					})
				}else{
					console.log(2222)
					filterData[0].valueArr = e
					filterData[0].nameArr = nameArr
				}
				console.log("this.temporaryArr",this.temporaryArr)
			},
			handleCheckbox(){
				let obj = {
					checkboxName:[],
					checkboxValue:[]
				}
				console.log("this.temporaryArr",this.temporaryArr)
				let arr = []
	
				this.temporaryArr.map(i=>{
					
					obj.checkboxName = [...obj.checkboxName,...i.nameArr]
					obj.checkboxValue = [...obj.checkboxValue,...i.valueArr]
				})
				
				if(obj.checkboxName.indexOf(this.disabledId + '日') < 0 ){
					console.log(1111111111)
					obj.checkboxName.push(this.disabledId + '日')
					obj.checkboxValue.push(this.disabledId)
				}
				
				console.log("this.radioValue",this.radioValue)
				this.$emit('update:checkboxShow', false)
				this.$emit("handleCheckbox", obj);
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
