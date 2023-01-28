<template>
  <view class="content">
    <view class="content_tab" v-for="(item,index) in list" :key="index">
      <view class="content_tab_text">
        {{item.title}}
      </view>
      <view class="content_tab_box">
        <view class="content_tab_box_list" v-for="(items,indexs) in item.listData" :key="indexs"  @click="go(items.url)">
          <image  :src='items.img' mode="widthFix"></image>
          <view>{{items.name}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import drafts from '@/static/images/page/drafts.png'
import issue from '@/static/images/page/issue.png'
import period from '@/static/images/page/period.png'
import audit from '@/static/images/page/audit.png'
import perform from '@/static/images/page/perform.png'
import overview from '@/static/images/page/overview.png'
import perform_overview from '@/static/images/page/perform_overview.png'
import allocation from '@/static/images/page/allocation.png'
import subtask from '@/static/images/page/subtask.png'
import positive from '@/static/images/page/positive.png'
import overdue from '@/static/images/page/overdue.png'
import schedule from '@/static/images/page/schedule.png'
import temporary from '@/static/images/page/temporary.png'
import personnel from '@/static/images/page/personnel.png'
export default {
  data() {
    return {
     list:[
        {
          title:'任务发布',
          listData:[{
              name:'草稿箱',
              img:drafts,
              url:'/pagesA/pages/draftBox/index'
            },
            {
              name:'已发布',
              img:issue,
              url:'/pagesA/pages/havePublished/index'
            },
            {
              name:'周期任务',
              img:period,
              url:'/pagesA/pages/periodTask/index'
            }]
        },
        {
          title:'审核中心',
          listData:[{
              name:'待审核',
              img:audit,
              url:'/pagesA/pages/audit/index'
            },
            {
              name:'已完成',
              img:perform,
              url:'/pagesA/pages/completed/index'
            }]
        },
        {
          title:'统计分析',
          listData:[{
              name:'情况总览',
              img:overview,
              url:'/pagesA/pages/taskOverview/index'
            },
            {
              name:'完成情况',
              img:perform_overview,
              url:'/pagesA/pages/performance/index'
            },
            {
              name:'分配情况',
              img:allocation,
              url:'/pagesA/pages/distribute/index'
            },
            // {
            //   name:'子任务分析',
            //   img:subtask,
            //   url:''
            // },
            {
              name:'响应度分析',
              img:positive,
              url:'/pagesA/pages/responsivity/index'
            }]
        },
        {
          title:'进度巡检',
          listData:[{
              name:'逾期任务',
              img:overdue,
              url:'/pagesA/pages/overdueTask/index'
            },
            {
              name:'进度巡检',
              img:schedule,
              url:'/pagesA/pages/taskPlan/index'
            },
            {
              name:'临期巡检',
              img:temporary,
              url:'/pagesA/pages/temporary/index'
            },
            {
              name:'人员进度',
              img:personnel,
              url:'/pagesA/pages/personnel/index'
            }]
        },
     ]
    }
  },
  methods: {
   go(url){
	   uni.navigateTo({url})
   }
  }
}
</script>

<style lang="scss" scoped>
  .content{
    &_tab{
      background: #fff;
      padding: 20rpx;
      box-sizing: border-box;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      &_text{
        font-weight: 600;
        font-size: 28rpx;
        margin-bottom: 20rpx;
      }
      &_box{
        display: flex;
        flex-wrap:wrap;
        &_list{
          width: 25%;
          text-align: center;
          margin-bottom: 10rpx;
          view{
            font-size: 24rpx;
          }
          image{
            width: 80rpx;
            height: 80rpx;
          }
        }
      }
      
    }
  }
</style>