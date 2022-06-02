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
    routes: []
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

  // 获取用户信息
  async getInfo({ commit }) {
    const res = await getInfo()
    const { name, avatar } = res.data
    commit('SET_NAME', name)
    commit('SET_AVATAR', avatar)
    // 用户信息获取完成 ->  二次加载路由（addRoutes）
    router.addRoutes(asyncRoutes)
    // 保存二级加载后的路由表
    commit('SET_ROUTES', [...constantRoutes, ...asyncRoutes])
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

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

