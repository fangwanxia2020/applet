<template>
	<view class="creaTask-2 content">
		<view class="creaTask-base">
			<view class="creaTask-title">周期设置</view>
			<u-form :model="form" ref="uForm" label-width='100' :border-bottom='false' label-position='left'>
				<u-form-item label="重复频率" required='true' prop='periodicType'>
					<view class="uni-list-cell-db">
						<uni-data-select :value="form.periodicType" :localdata="cycleFrequencyList"
							@change="periodicChang" :clear='false'></uni-data-select>
					</view>
				</u-form-item>


				<view class="tips" >
					<view> <text>{{dayName}}</text>任务将于{{days}}{{haoNumber}}重复 </view>
					<view>结束于{{endName}}共{{taskNums}}次任务 </view>
				</view>


				<view class="creaTask-day">
					<u-form-item label="生成日期" required='true' v-if="form.periodicType == '2'" prop='creationType'>
						<view class="uni-list-cell-db">
							<uni-data-select :value="form.creationType" :localdata="generationDateList"
								@change="typeChange" :clear='false'></uni-data-select>
						</view>
					</u-form-item>
	
					<u-form-item label="频率次数" required='true' v-if="form.periodicType == '3' "  @click="radioShow = true">
						<view class="uni-list-cell-db">
							<u-input placeholder="请选择频率次数" disabled disabledColor='#ffffff' type='textarea'
								border='false' :auto-height='true' maxlength='1000' v-model='form.customizeFrequency_label' />
						</view>
						<!-- <text class="item-text">请选择</text> -->
						<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" >
						</u-icon>
					</u-form-item>
					<u-form-item label="频率日期" required='true' v-if="form.periodicType == '3' "   @click="checkboxShowConfig">
						<view class="uni-list-cell-db">
							<u-input placeholder="请选择频率日期" v-model='form.customizeFrequencyNum_label' disabled
								disabledColor='#ffffff' type='textarea' border='false' :auto-height='true'
								maxlength='1000' />
						</view>
						<!-- <text class="item-text">请选择</text> -->
						<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18">
						</u-icon>
					</u-form-item>
					<u-form-item label="任务开始时间" required='true' prop='taskStartTime' @click="pickData(1)">
						<view class="uni-list-cell-db">
							<u-input placeholder="请选择任务开始日期" v-model='form.taskStartTime' disabled
								disabledColor='#ffffff' type='textarea' border='false' :auto-height='true'
								maxlength='1000' />
						</view>
						<!-- <text class="item-text">请选择</text> -->
						<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" >
						</u-icon>
					</u-form-item>

					<u-form-item label="任务结束时间" required='true' prop='taskEndTime' @click="pickData(2)">
						<view class="uni-list-cell-db" >
							<u-input placeholder="请选择任务开始日期" disabled disabledColor='#ffffff' type='textarea'
								border='false' :auto-height='true' maxlength='1000' v-model='form.taskEndTime' />
						</view>
						<!-- <text class="item-text">请选择</text> -->
						<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" >
						</u-icon>
					</u-form-item>

					<u-form-item label="结束重复" required='true' prop='periodicEndType' >
						<view class="uni-list-cell-db">
							<uni-data-select :value="form.periodicEndType" :localdata="endRepeatList"
								@change="cyclehange" :clear='false'></uni-data-select>
						</view>
					</u-form-item>


					<u-form-item label="次数" required='true' v-if="form.periodicEndType == '2' " prop='taskFrequency'>
						<view class="uni-list-cell-db">
							<u-input v-model='form.taskFrequency' placeholder="请输入次数" disabledColor='#ffffff'
								type='number' border="false"  @change="numsChange()" :auto-height='true' maxlength='1000' />
						</view>
					</u-form-item>
					<u-form-item label="结束重复日期" required='true' v-if="form.periodicEndType == '1' "
						prop='periodicEndTime'>
						<view class="uni-list-cell-db" @click="dateShow = true">
							<u-input placeholder="请选择结束重复日期" disabled disabledColor='#ffffff' type='textarea'
								border='false' :auto-height='true' maxlength='1000' v-model='form.periodicEndTime' />
						</view>
						<!-- <text class="item-text">请选择</text> -->
						<u-icon name="arrow-right" color="rgb(192, 196, 204)" size="18" @click="pickData(3)">
						</u-icon>
					</u-form-item>
				</view>

			</u-form>
		</view>

<view class="next-btn clearfix"> 
		<view class='next'>
			
				<button  @click="back">上一步</button>
		
		
				<button style="background-color: #026DFF;" type="primary" @click='submit'>发布</button>
			
		

		</view>
		</view>

		<!-- <u-calendar :show="dateShow" @confirm="canlendarConfirm" @close="dateShow = false"></u-calendar> -->
		<u-datetime-picker v-model='dateValue' :minDate="startDisabledDate" :show="startTimeShow" @cancel="startTimeShow = false" mode="datetime"
			@confirm="startTimeConfirm"></u-datetime-picker>
			<u-datetime-picker v-model='dateValue' :minDate="endDisabledDate" :show="endTimeShow" @cancel="endTimeShow = false" mode="datetime"
				@confirm="endTimeConfirm"></u-datetime-picker>
		<u-datetime-picker v-model='dateValue' :show="dateShow" @cancel="dateShow = false" mode="date"
			@confirm="dateConfirm" :minDate="disabledDate"></u-datetime-picker>

			
			<date-checkbox title="频率日期" v-if='disabledIdFlag' @handleCheckbox="handleCheckbox"  :checkboxShow.sync='checkboxShow' :disabledId= "disabledId"  :andExprData='dayNumsList'></date-checkbox>
			<date-radio title="频率次数"  :radioShow.sync='radioShow' @handleRadio="handleRadiobox"  :andExprData='frequencyList' ></date-radio>
	</view>


</template>

<script>
	import {
		add,
		getTaskCount
	} from "@/api/pagesA/period-task.js"
	import dateCheckbox from "@/pagesA/components/date-checkbox/index.vue"
	import dateRadio from "@/pagesA/components/date-radio/index.vue"
	import toDateUtil from '@/utils/date.js';
	export default {
		components:{
		dateCheckbox,
		dateRadio
		},
		data() {
			return {
				timeArr: [],
				startTimeShow:false,
				endTimeShow:false,
				startDisabledDate:new Date().getTime(), //当前任务开始最小时间
				disabledId:new Date().getDate(), // 频率日期
				disabledIdFlag:true,
				endDisabledDate:'',// 任务结束最小时间
				  time: '',
				dayName: '每天',
				days:'每天',
				haoNumber:'',
				endName:'',
				taskNums:'1',
				checkboxShow:false,
				radioShow:false,
				FrequencyFlag:'',
				dateValue: Number(new Date()),
				accessShow: false,
				accessColumns: [],
				form: {
				
					fileIds: [],
					name: '',
					folderId: '',
					taskTypeId: '',
					urgency: 2,
					taskContent: '',
					periodicEndTime: '',//结束重复日期
					// 频率
					customizeFrequency_label: '每1',
					customizeFrequency: '1',
					customizeFrequencyNum_label: '',
					customizeFrequencyNum:'',
					// 生成日期
					creationType: '1', //生成日期
					taskStartTime: "", //任务开始时间
					taskEndTime: '',//任务结束时间

					// 次数
					taskFrequency: '',
					frequency: 1,
					periodicType: '1',
					periodicEndType: '1',
				},
				DataFlag: '',
				// 频率
				frequencyList: [
				],
				dayNumsList: [],
				dateShow: false,
				timeShow: false,
				cycleValue: "1",
				show: false,
				// 重复频次
				cycleFrequencyList: [{
						value: '1',
						text: '每天',
					},
					{
						value: '2',
						text: '每月',
					},
					{
						value: '3',
						text: '自定义',
					}
				],
				// 生成日期
				generationDateList: [{
						value: '1',
						text: '生成于某天',
					},
					{
						value: '2',
						text: '生成于月的最后一天',
					},
				],
				// 结束重复
				endRepeatList: [{
						value: '1',
						text: '结束于某天',
					},
					{
						value: '2',
						text: '限定任务次数',
					},
				],
				rules: {

				},
				disabledDate:''
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
	
		watch:{
			'form.taskStartTime':{
				  handler(val){
				          console.log("val11",val)
						  let date = new Date(val.slice(0,10))
						  this.disabledDate = date.getTime()
				         },
						 immediate:true
			}
		},
		onLoad(option) {
			console.log("option", option)
			let json = JSON.parse(option.formJson)
	this.form = {...this.form,...json}
			console.log("this.form",)
			this.init()
			this.initTime()
		},
		methods: {
			
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
			// 发布
			async submit() {
				console.log("发布", this.form)
				// 重复频率
				if (this.form.periodicType == '1') {
					this.form.creationType = ''
					this.form.customizeFrequency = ''
					this.form.customizeFrequencyNum = ''
				} else if (this.form.periodicType == '2') {
					this.form.customizeFrequency = ''
					this.form.customizeFrequencyNum = ''
				} else if (this.form.periodicType == '3') {
					this.form.creationType = ''
				}

				// 结束于某天
				if (this.form.periodicEndType == '1') {
					this.form.taskFrequency = ''
				} else {
					this.form.periodicEndTime = ''
				}
				let formObj = JSON.parse(JSON.stringify(this.form))
				formObj.periodicEndTime = new Date(formObj.periodicEndTime+ ' 23:59:59').getTime()
				formObj.taskStartTime = new Date(formObj.taskStartTime).getTime()
				formObj.taskEndTime = new Date(formObj.taskEndTime).getTime()
				formObj.periodicEndType = Number(formObj.periodicEndType)
				formObj.periodicType = Number(formObj.periodicType)
				formObj.taskTypeId = formObj.tackTypeId
				if(formObj.taskEndTime < formObj.taskStartTime || formObj.taskEndTime == formObj.taskStartTime  ){
					uni.$u.toast('任务结束时间不能早于或等于任务开始时间')
					return
				}
				if(formObj.taskEndTime > formObj.periodicEndTime ){
					uni.$u.toast('结束重复时间不能早于任务开始时间')
					return
				}
				console.log("this.form", this.form)
				const res = await add(formObj)
				if(res.code == 200){
					uni.$u.toast("新增成功")
					uni.redirectTo({
						url: "/pagesA/pages/periodTask/index"
					
					})
				}
			},
			pickData(e) {
				this.DataFlag = e
				if (e == 3) {
					this.dateShow = true
				} else if(e == 2) {
					this.endTimeShow = true
				}else if(e == 1){
					this.startDisabledDate = new Date().getTime()
					this.startTimeShow = true
				}

			},
			init() {
				this.frequencyList = []
				this.dayNumsList = []
				// let value = Number(new Date().getDate())
				// this.customizeFrequencyNum.push(value)
				console.log("this.frequencyList111111111111", )
				for (let i = 1; i <= 12; i++) {
					this.$set(this.frequencyList,i-1,{
						id: i,
						label: '每' + i,
					})
				}
				for (let i = 1; i <= 31; i++) {
					this.dayNumsList.push({
						id: i,
						label: i + '日',
					})
				}

				console.log("this.frequencyList", this.frequencyList)
			},
			
			// 初始化当前日期
			initTime(){
				let currentD= new Date().getDate()
				this.form.creationType = '1'
				this.form.customizeFrequencyNum_label = currentD + "日"
				this.form.customizeFrequencyNum = currentD 
				 let currentTime = this.changeTimeFormat(new Date().getTime())
			
				this.form.taskStartTime = currentTime
				this.form.taskEndTime = currentTime
				this.form.periodicEndTime = currentTime.slice(0,10)
			
			},
			// 选择任务开始时间
			startTimeConfirm(e){
				console.log("eeeee",e)
				let value = this.changeTimeFormat(e.value)
				this.form.taskStartTime = value
				console.log("value",value)
				this.disabledId = value.slice(8,10)
				this.disabledIdFlag = false
				this.form.customizeFrequencyNum_label = this.disabledId + "日"
				this.form.customizeFrequencyNum = this.disabledId
				console.log("this.disabledId",this.disabledId)
				this.startDisabledDate = new Date().getTime()
				
				let endTime = new Date(this.form.taskEndTime).getTime()
				let periodicEndTime =  new Date(this.form.periodicEndTime).getTime()
				if (endTime < e.value){
					this.form.taskEndTime = value
				}
				if(periodicEndTime < e.value){
					this.form.periodicEndTime =value.slice(0,10)
				}
				this.endDisabledDate =  new Date(this.form.taskStartTime).getTime()
				this.startTimeShow = false
				this.changeTip()
			},
			endTimeConfirm(e) {
				let value = this.changeTimeFormat(e.value)
	
					let startTime = new Date(this.form.taskStartTime).getTime()
					if(e.value < startTime ){
						uni.$u.toast('任务结束时间不能早于或等于任务开始时间')
						return
					}
					
					this.form.taskEndTime = value
				// let periodicEndTime = new Date(this.form.periodicEndTime).getTime()
				// 			if(e.value > periodicEndTime ){
				// 				this.form.periodicEndTime = this.form.taskEndTime.slice(0,10)
				// 			}
			


				this.endTimeShow = false
				this.changeTip()
			},
			dateConfirm(e) {
				let value = this.changeTimeFormat(e.value)
				this.form.periodicEndTime = value.slice(0, 10)
				this.dateShow = false
				console.log("e2", e)
				this.changeTip()
			},
			changeTimeFormat(time) {
				var date = new Date(time);
				var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
				//返回格式：yyyy-MM-dd hh:mm
			},
			cyclehange(e) {
				console.log(e)
				if(e == 1){
					this.form.taskFrequency = ''
				}else{
					this.form.periodicEndTime = ''
				}
				this.form.periodicEndType = e
			},
			typeChange(e) {
				this.form.creationType = e
				let hm = " 00:00"
				      if (this.form.periodicEndType == 1) {
				          this.changeTip()
				        } else {
				          this.numsChange()
				        }
						
						       if (this.form.creationType == '2') {
						          this.form.taskStartTime = this.getCurrentMonthLast(this.form.taskStartTime.slice(0, 10))+hm
						          this.days = '每月' + this.form.taskStartTime.substring(7, 9).replace(/\//g, "-") + '号'
						          this.form.taskEndTime = this.form.taskStartTime
						          this.form.periodicEndTime = this.getCurrentMonthLast(this.form.taskStartTime.slice(0, 10))
					
						
						        } else if (this.form.creationType == '1') {
						          this.days = '每月' + this.form.taskStartTime.substring(8, 10) + '号'
						        }
						this.changeTip()
			},
			periodicChang(e){
				this.initTime()
				console.log("e",e,this.form.periodicType)
				console.log("this.form.taskStartTime",this.form.taskStartTime)
				this.form.periodicType = e
				   let arr = this.cycleFrequencyList.filter((item) => {
				          if (item.value == this.form.periodicType) return item.text
				        })
						 this.dayName = arr[0].text
						        if (this.form.periodicType!= 3) {
						           if (arr[0].text == '每月') {
						             this.days = arr[0].text + this.form.taskStartTime.substring(8, 10) + '号'
						           } else {
						             this.days = arr[0].text
						           }
								   this.haoNumber = ''
						         } else {
						           //重复频率为自定义
						           this.init() 
						           let arr = this.frequencyList.filter((item) => {
						             if (item.value == this.form.customizeFrequency_label) return item.text
						           })
						           if (arr.length != 0) {
						             this.days = arr[0].text + '个月'
						           } else {
						             this.days = '每1个月'
						           }
						       this.haoNumber = this.form.customizeFrequencyNum_label
						         }
								  //重复频率
								         if(this.form.periodicType==1||this.form.periodicType==3){
								           this.form.creationType=''
								         }
										 this.changeTip()
			},
			  
			
			    numsChange() {
			        if (this.form.periodicType == 1) {
			          this.endName = this.fun_date(this.form.taskFrequency - 1)
			          this.taskNums = this.form.taskFrequency
			        } else if (this.form.periodicType == 2) {
						if(this.form.creationType == 2){
							this.taskNums = this.form.taskFrequency
							            let cycleStartDateSplit = this.form.taskStartTime.split('-')
										 console.log("cycleStartDateSplit",cycleStartDateSplit)
							            let  numsAll=this.form.taskFrequency-1
							            let afterMonth = this.nafterMonth(cycleStartDateSplit[0] + cycleStartDateSplit[1], numsAll)
										console.log("afterMonth,",afterMonth)
							            this.endName = this.getCurrentMonthLast(afterMonth.substring(0, 4) + '-' + afterMonth.substring(4, 6)).replace(/\//g, "-")
						}
						else{
							this.taskNums = this.form.taskFrequency
							console.log("this.form.taskFrequency",this.form.taskFrequency)
							console.log("this.form.taskStartTime1111111",this.form.taskStartTime)
							this.endName = this.getNextMonth(this.form.taskStartTime.slice(0,10), this.form.taskFrequency)
							console.log("this.endName",this.endName)
						}
			          
			        } else {
			          this.customAndNum()
			        }
			      },
				      nafterMonth(dtstr, n) {
				          let a = Number(dtstr.substring(0, 4)) //年
				          let b = Number(dtstr.substring(4, 6)) //月
				          let c = Number(n) + b
				          if(c > 12){
				            let d = parseInt(c/12) //取整
				            let e = c%12 //取余数
				            a = a + d
				            c = e || 12
				          }
				          // var dt = new Date(dtstr.substring(0, 4), dtstr.substring(4, 6), 1);
				          // dt.setMonth(dt.getMonth() + n);
				          // var yy1 = dt.getFullYear();
				          // var mm1 = dt.getMonth();
				          // if (mm1 < 10) {
				          //   mm1 = "0" + mm1;
				          // }
				          return a + "" + c;
				        },
	   //获取最近多少天的日期
	      getNextMonth(nowTime, num) {
			  console.log("nowTime, num",nowTime, num)
	           //tttt为现在的日期 2022-2-9
	           var d = new Date(nowTime);
			   console.log("d",d)
	           //最后的 +2 意思是获取下个月的今天
	           //如果是 +5 意思是获取四个月后的今天
	           //如果是 +10 意思是获取九个月后的今天  以此类推
	           //      let month= num+1
	           //    由于包含本月，所以不用加1
	           let month = Number(num) 
	           d.setMonth((d.getMonth() - 1) + month);
	           var yy1 = d.getFullYear();
			   console.log("yy1",yy1)
	           var mm1 = d.getMonth() + 1;
	           var dd1 = d.getDate();
	           if (mm1 < 10) {
	             mm1 = '0' + mm1;
	           }
	           if (dd1 < 10) {
	             dd1 = '0' + dd1;
	           }
	           var time = yy1 + '-' + mm1 + '-' + dd1;
	           //最后打印可获取到 n 个月后的今天
	           return time
	         },
			   func(a, b) {
			         return a - b;
			       },
			       customAndNum(){
			         this.taskNums = this.form.taskFrequency
			         //50为次数的最大值
			         this.getData(50)
			         this.timeArr.unshift(this.form.taskStartTime.slice(0,10));
					 console.log("this.timeArr",this.timeArr)
			         let formatTimeArr= this.timeArr.map(item=>{
			           return   item.substring(0,7)
			         })
			         let gg=[]
					 console.log("this.form.customizeFrequencyNum.sort",  this.form.customizeFrequencyNum )
					 let arrNum = []
					 if(this.form.customizeFrequencyNum.indexOf(',') > 0){
						 arrNum = this.form.customizeFrequencyNum.split(',')
					 }else{
						 arrNum[0] = this.form.customizeFrequencyNum
					 }
					 console.log(" arrNum", arrNum)
			         let sortNums  =arrNum.sort(this.func)
			         for (let j = 0; j <formatTimeArr.length ; j++) {
			           for (let i = 0; i <sortNums.length ; i++) {
			             gg.push(new Date(formatTimeArr[j]+'-'+sortNums[i]))
			           }
			         }
			         let start=   new Date( this.form.taskStartTime.slice(0,10))
			         let newArr=[]
			         for (let i = 0; i < gg.length; i++) {
			           if(gg[i]>=start){
			             newArr.push(gg[i])
			           }
			         }
					 console.log("newArr",newArr)
			         this.endName= this.toDateUtil.formatDateTime(newArr[this.form.taskFrequency-1], "yyyy-MM-dd");
			       },
				     getData(val){
				          this.timeArr=[]
				          for (let i = 0; i < val; i++) {
				            if(i ==0){
								console.log("this.form.taskStartTime.slice(0,10)",this.form.taskStartTime.slice(0,10))
				              this.getNextMonthTwo( this.form.taskStartTime.slice(0,10) , this.form.customizeFrequency)
							  console.log("this.time",this.time)
				   
				            }else {
				              this.getNextMonthTwo( this.time , this.form.customizeFrequency)
				   
				            }
				            this.timeArr.push(this.time)
				          }
				        },
						    getNextMonthTwo(nowTime, num) {
						        //nowTime为2022-08   num 为2， 2022-10
						        var d = new Date(nowTime);
						        //最后的 +2 意思是获取下个月的今天
						        //如果是 +5 意思是获取四个月后的今天
						        //如果是 +10 意思是获取九个月后的今天  以此类推
						        let month= Number(num) +1
						        d.setMonth((d.getMonth() - 1) + month);
						        var yy1 = d.getFullYear();
						        var mm1 = d.getMonth() + 1;
								
						        var dd1 = d.getDate();
						        if (mm1 < 10) {
						          mm1 = '0' + mm1;
						        }
						        if (dd1 < 10) {
						          dd1 = '0' + dd1;
						        }
								console.log("mm1",mm1)
						        this.time = yy1 + '-' + mm1 + '-' + dd1;
						        //最后打印可获取到 n 个月后的今天
						        // return time
						      },
	      fun_date(dayNumber) {
	        var dateTime = new Date(this.form.taskStartTime);
	        var dateEnd = new Date(dateTime);
	        dateEnd.setDate(dateTime.getDate() + dayNumber);
	        var endTime = dateEnd.getFullYear() + "-" + this.addWords(dateEnd.getMonth() + 1) + "-" + this.addWords(dateEnd.getDate());
	        return endTime;
	      },
		     addWords(num) {
		          return num < 10 ? '0' + num : num;
		        },
			pickerConfirm(e) {
				console.log('e',e)
				if(this.FrequencyFlag == 1){
					this.form.customizeFrequencyNum = e
				}
				this.accessShow = false
			},
			handleCheckbox(e){
				console.log("e11",e)
				let arr = []
				e.checkboxName.map(i=>{
					let value = i.split("日")
					console.log("value",value)
					arr.push(value[0])
				})
				this.form.customizeFrequencyNum_label = [...e.checkboxName].join()
				this.form.customizeFrequencyNum = [...arr].join()
		

					
				this.haoNumber = this.form.customizeFrequencyNum_label
				 this.changeTip()
			},
			handleRadiobox(e){
				console.log("e",e)
			this.days = e.radioName + "个月"
				this.form.customizeFrequency_label = e.radioName
				this.form.customizeFrequency = e.radioValue
				 this.changeTip()
			},
			      // 计算两个日期距离的天数
			     getDistanceDays(date1,date2){
			    // date1例如:'2022-03-05',date2例如:'2022-03-06'
			    const date1_timeStamp = this.toTimeStamp(date1)
			    const date2_timeStamp = this.toTimeStamp(date2)
			    let max = '', min = ''
			    if(date1_timeStamp>date2_timeStamp){
			      max = date1_timeStamp
			      min = date2_timeStamp
			    }else{
			      max = date2_timeStamp
			      min = date1_timeStamp
			    }
			    // 例如返回:'1'
			    return (max-min)/(24*60*60*1000)
			  },
			        // 指定时间转换为时间戳
			      toTimeStamp(dateString){
			      // dateString例如:'2022-03-05'
			      // 例如返回:1646611200000
			      return new Date(dateString) - 0
			    },
				      //获取指定时间的最后一天
				      getCurrentMonthLast(date) {
						  console.log("date2222",date)
				        var endDate = new Date(date); //date 是需要传递的时间如：2018-08
				        var month = endDate.getMonth();
				        var nextMonth = ++month;
				        var nextMonthFirstDay = new Date(endDate.getFullYear(), nextMonth, 1);
				        var oneDay = 1000 * 60 * 60 * 24;
				        var dateString = new Date(nextMonthFirstDay - oneDay);
				        console.log(dateString) //Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间)
						console.log('dateString.toLocaleDateString().replace("/","-")',dateString.toLocaleDateString().replace(/\//g,"-"))
				       // return dateString.toLocaleDateString().replace(/\//g,"-") ; //toLocaleDateString() 返回 如：2018/8/31
						return dateString.getFullYear() + "-" + JSON.stringify(dateString.getMonth() + 1).padStart(2, 0) + "-" + JSON.stringify(dateString.getDate()).padStart(2, 0);
				
				      },
					  checkboxShowConfig(){
						  this.disabledIdFlag = true
						  this.checkboxShow  =true 
						  
					  },
			      changeTip(){
			        //  每天
			        if (this.form.periodicType == 1) {
			          if(this.form.periodicEndType== 1){
			            this.taskNums = this.getDistanceDays(this.form.periodicEndTime.substring(0,10),this.form.taskStartTime.substring(0,10))+1
			            this.endName = this.form.periodicEndTime.substring(0, 11)
			          }else if(this.form.periodicEndType == 2){
			            this.endName = this.fun_date(this.form.taskFrequency - 1)
			            this.taskNums = this.form.taskFrequency
			          }
			        //  每月
			        } else if(this.form.periodicType == 2) {
			          if(this.form.periodicEndType=='1'){
			            this.endName = this.form.periodicEndTime.substring(0, 11)
			            this.getTaskCount()
			          }else {
			            this.taskNums = this.form.taskFrequency
			            if(this.form.creationType == '2'){
							console.log("this.form.periodicEndType1111",this.form.periodicEndType)
			             this.form.taskStartTime = this.getCurrentMonthLast(this.form.taskStartTime.slice(0, 10)).replace(/\//g, '-') + ' 00:00'
			              this.endName = this.getNextMonth(this.form.taskStartTime, this.form.taskFrequency)
			            }else{
			              this.endName = this.getNextMonth(this.form.taskStartTime, this.form.taskFrequency)
			            }
			          }
			        //  自定义
			        }else{
			          if(this.form.periodicEndType=='1'){
			            this.endName = this.form.periodicEndTime.substring(0, 11)
			            this.getTaskCount()
			          }else{
			            this.customAndNum()
			          }
			        }
			      },
				        getTaskCount() {
				  // 重复频率
				  // if (this.form.periodicType == '1') {
				  // 	this.form.creationType = ''
				  // 	this.form.customizeFrequency = ''
				  // 	this.form.customizeFrequencyNum = ''
				  // } else if (this.form.periodicType == '2') {
				  // 	this.form.customizeFrequency = ''
				  // 	this.form.customizeFrequencyNum = ''
				  // } else if (this.form.periodicType == '3') {
				  // 	this.form.creationType = ''
				  // }
				  
				  // // 结束于某天
				  // if (this.form.periodicEndType == '1') {
				  // 	this.form.taskFrequency = ''
				  // } else {
				  // 	this.form.periodicEndTime = ''
				  // }
				  let formObj = JSON.parse(JSON.stringify(this.form))
				  formObj.periodicEndTime = formObj.periodicEndTime+ ' 23:59:59'
				  formObj.taskStartTime = formObj.taskStartTime + ':59'
				  formObj.taskEndTime = formObj.taskEndTime + ':59'
				  formObj.periodicEndType = Number(formObj.periodicEndType)
				  formObj.periodicType = Number(formObj.periodicType)
				  formObj.taskTypeId = formObj.tackTypeId
				  
				          getTaskCount(formObj).then((res) => {
				            if (res.code == 200) {
				               this.taskNums=  res.data
				            }
				          });
				        },
		
		}
	}
</script>

<style lang="scss" scoped>

	




	.tips {
		// background-color:#eeeeee ;
		background-color: rgba(153, 153, 153, 0.1);
		padding: 16rpx 30rpx;
		margin-top: 20rpx;


		view {
			color: #030303;
			font-size: 30rpx;

			text {
				color: #026DFF;
				padding-right: 20rpx;
			}
		}
	}

	::v-deep .uni-list-cell-db {
		.uni-input {
			height: 35px !important;
			line-height: 35px !important;

		}
	}

	::v-deep .uni-list-item {
		display: flex;
		width: 100%;
		align-content: space-between;
		flex-direction: row;

		uni-data-select {
			width: 45%;
			margin-right: 20rpx;
		}
	}

	::v-deep .uni-select__selector {
		z-index: 4;
	}



	::v-deep .creaTask-base {
		background-color: #FFFFFF;
		box-sizing: border-box;
		width: 100%;
padding: 16rpx 40rpx;
	
	border-radius: 10rpx;
	margin-bottom: 100rpx;

		.item-text {
			color: #DCDCDC;
			line-height: 70rpx;
		}

		.tips {
			color: rgb(192, 196, 204);
		}

		.creaTask-title {
			font-size: 32rpx;
			font-weight: 600;
			margin-bottom: 16rpx;

			
		}
	}

	::v-deep .u-form-item__body {
		align-items: flex-start;
		border-bottom: 1rpx solid #DCDCDC;
		padding: 0;
		height: 80rpx;
		margin-top: 30rpx
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

	::v-deep .u-input__content__field-wrapper {
		line-height: 70rpx;
		height: 70rpx;

	}

	::v-deep .u-input{
		padding-top: 2px !important;
	}
	
	.next-btn{
		position: fixed !important;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		margin: auto !important;
		width: calc(100% - 40rpx) !important;
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
		
	.clearfix:after{
	
	    content:"";
	
	    display:block;
	
	    visibility:hidden;
	
	    clear:both;
	
	    }
</style>
