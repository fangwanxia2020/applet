<template>
  <view class="login">
    <view class="login_box">
    	<u-image
    	  class="login_box__logo"
    	  width="150rpx"
    	  height="150rpx"
    	  mode="aspectFit"
    	  :src="logoImg"
    	/>
    </view>
    <u-form
      class="login__form"
      ref="loginForm"
      label-position="left"
      label-width="50rpx"
      error-type="toast"
      :model="formData"
      :rules="formRules"
    >
      <u-form-item
        class="login__form__item"
        prop="username"
        left-icon="account-fill"
      >
        <u-input
          class="login__form__item__input"
          maxlength="30"
          placeholder="账号"
          border="none"
          fontSize="26rpx"
          v-model="formData.username"
        />
      </u-form-item>
      <u-form-item
        class="login__form__item"
        prop="password"
        left-icon="lock-fill"
      >
        <u-input
          class="login__form__item__input"
          type="password"
          maxlength="30"
          placeholder="密码"
          border="none"
          fontSize="26rpx"
          v-model="formData.password"
        />
      </u-form-item>
    </u-form>
    <u-button
      class="login__button"
      type="primary"
      size="large"
      shape="circle"
      :customStyle="{
        padding: '40rpx 0',
        fontSize: '32rpx'
      }"
      @click="handleLogin"
    >登录</u-button>
  </view>
</template>

<script>
import md5 from 'js-md5'
import logoImg from '@/static/images/statusBarLayout/avatar.png'
import { TOKEN_KEY } from '@/api/http'
import { login, orgList,oauthToken,getInfo } from '@/api/login'

export default {
  name: 'Login',
  data() {
    return {
      logoImg,
      formRules: {
        username: {
          required: true,
          message: '账号不能为空'
        },
        password: {
          required: true,
          message: '密码不能为空'
        }
      },
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    init() {
      // 判断是否有token
      const token = uni.getStorageSync(TOKEN_KEY)
      if (token) {  // 登录以后，当前访问的页面是登录页，则返回原来的页面
        this.loginNavigate()
      }
      if (process.env.VUE_APP_TENANT_CODE) {
        this.initOrgId()
      }
    },
    async initOrgId() {
      const res = await orgList({ tenantCode: process.env.VUE_APP_TENANT_CODE })
      const resData = res.data || []
      const [org = {}] = resData
      this.formData.orgId = org.id
    },
    /** 处理登录导航 */
    loginNavigate() {
      const pages = getCurrentPages()  // 获取页面栈
			console.log(pages)
      let routeOption = { type: 'navigateBack' }  // 默认跳回原来页面
      if (pages.length === 1) {  // 如果只有一个页面，则跳去首页
        routeOption = {
          type: 'switchTab',
          url: '/pages/homePage/index'
        }
      }
      this.$u.route(routeOption)
    },
    async handleLogin() {
      const { formData, $refs } = this
      await $refs.loginForm.validate()  // 校验表单
      const { password } = formData
      const res = await oauthToken({
        ...formData,
				grant_type: "password",
				client_id: "testclient",
				client_secret: "testclient",
				password: md5(password),
      })
      const { access_token,user_id } = res

      uni.setStorageSync(TOKEN_KEY, access_token)  // 设置 token
      uni.setStorageSync('USER_ID', user_id)  // 设置 token
			const info = await getInfo()
			console.log(info)
			uni.setStorageSync('info',info.data)
      this.loginNavigate()
    }
  },
  onLoad() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 100rpx 40rpx 0;
	&_box{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		&__logo {
		  width: 150rpx;
		}
	}
  &__form {
    margin-bottom: 80rpx;
    &__item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #d7d7d7;
      ::v-deep {
        .u-icon {
          &__icon {
            font-size: 34rpx !important;
            color: $uni-text-color-placeholder !important;
          }
        }
      }
    }
  }
}
</style>