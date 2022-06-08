import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'

const getDefaultState = () => {
  return {
    // token值
    token: getToken(),
    // 用户名
    name: '',
    // 用户头像
    avatar: '',
    // 总路由表
    routes: [],
    // 按钮权限列表
    buttons: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state值
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token值
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置name值
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 设置头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 设置路由表
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  // 设置权限按钮列表
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    // 1. 解构用户信息
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 2. 调用loginAPI函数 发起请求
      login({ username: username.trim(), password: password }).then(response => {
        // 3. 登录成功
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        // 3. 登录失败
        reject(error)
      })
    })
  },

  // 获取用户信息(权限)
  async getInfo({ commit }) {
    const res = await getInfo()
    const { name, avatar, routes, buttons } = res.data
    commit('SET_NAME', name)
    commit('SET_AVATAR', avatar)
    commit('SET_BUTTONS', buttons)
    // 用户信息获取完成 ->  二次加载路由（addRoutes）
    // 根据用户权限 筛选动态路由
    const routeList = filterRoutes(asyncRoutes, routes)
    router.addRoutes(routeList)
    // 保存二级加载后的路由表
    commit('SET_ROUTES', [...constantRoutes, ...routeList])
  },

  // 退出登录
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 筛选路由
const filterRoutes = (routes, rightsList) => {
  const result = []
  // 循环所有路由
  routes.forEach(route => {
    // 判断当前路由是否需要权限
    if (route.meta && route.meta.rights) {
      // 需要权限 -> 验证当前用户是否满足该路由权限
      if (rightsList.includes(route.meta.rights)) {
        // 判断是否有子级（有子级则继续筛选）
        if (route.children && route.children.length) {
          route.children = filterRoutes(route.children, rightsList)
        }
        result.push(route) // 存在 则添加到数组中
      }
    } else {
      // 不需要权限
      // 判断是否有子级（有子级则继续筛选）
      if (route.children && route.children.length) {
        route.children = filterRoutes(route.children, rightsList)
      }
      result.push(route) // 存在 则添加到数组中
    }
  })
  return result
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

