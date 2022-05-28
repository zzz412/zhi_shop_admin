import request from '@/utils/request'

// 获取用户列表
export const reqUserList = (page, limit, params) => request({ url: `admin/acl/user/${page}/${limit}`, method: 'get', params })

// 获取用户角色列表
export const reqUserRole = id => request({ url: `/admin/acl/user/toAssign/${id}`, method: 'get' })
