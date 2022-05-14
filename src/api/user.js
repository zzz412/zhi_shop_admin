import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/acl/index/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/acl/index/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
