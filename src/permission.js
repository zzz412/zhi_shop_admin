import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login'] // 不需要验证的路由名单

// 全局守卫: 路由跳转前
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取本地token
  const hasToken = getToken()

  // 判断是否具有Token
  if (hasToken) {
    // 有token 判断当前页面是否为登录
    if (to.path === '/login') {
      // 已经有token 就不再允许进入登录页 跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取登录的用户名
      const hasGetUserInfo = store.getters.name
      // 判断是否有用户名
      if (hasGetUserInfo) {
        // 有用户名 放行
        next()
      } else {
        // 无用户名 重新获取用户名
        try {
          // 派发actions 发起请求获取用户名
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // 清除token 并且 注销登录
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 无token

    // 判断当前地址 是否 存在于白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // 当前地址不需要权限  放行
      next()
    } else {
      // 当前地址需要权限 跳转到登录
      next(`/login?redirect=${to.path}`)
      // 关闭进度条
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
