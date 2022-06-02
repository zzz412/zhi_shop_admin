import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果为true则不会显示在侧边栏中
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               设置侧边栏中的标题 与 面包屑中的标题
    icon: 'svg-name'/'el-icon-x' 设置侧边栏的图标【element-ui 与 svg】
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 基础路由（提供用户基本操作【登录】）
export const constantRoutes = [
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 主页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  }
]

// 权限路由（登录后根据权限二次加载的）
export const asyncRoutes = [
  // 权限管理
  {
    path: '/acl',
    component: Layout,
    meta: { title: '权限管理', icon: 'el-icon-key' },
    children: [
      // 用户管理
      { path: '/acl/user', component: () => import('@/views/acl/user'), meta: { title: '用户管理' }},
      // 角色管理
      { path: '/acl/role', component: () => import('@/views/acl/role'), meta: { title: '角色管理' }},
      // 菜单管理
      { path: '/acl/permission', component: () => import('@/views/acl/permission'), meta: { title: '菜单管理' }}
    ]
  },
  // 商品管理
  {
    path: '/goods',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      // 品牌
      { path: '/goods/trademark', component: () => import('@/views/goods/trademark'), meta: { title: '品牌管理' }},
      // 属性
      { path: '/goods/attr', component: () => import('@/views/goods/attr'), meta: { title: '属性管理' }},
      // SPU
      { path: '/goods/spu', component: () => import('@/views/goods/spu'), meta: { title: 'SPU管理' }},
      // SKU
      { path: '/goods/sku', component: () => import('@/views/goods/sku'), meta: { title: 'SKU管理' }}
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
