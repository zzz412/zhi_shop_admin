import request from '@/utils/request'

// 获取用户列表
export const reqUserList = (page, limit, params) => request({ url: `admin/acl/user/${page}/${limit}`, method: 'get', params })

// 获取用户角色列表
export const reqUserRole = id => request({ url: `/admin/acl/user/toAssign/${id}`, method: 'get' })

// 设置用户的角色列表
export const reqSaveUserRole = (userId, roleId) => request({ url: `/admin/acl/user/doAssign`, method: 'post', params: { userId, roleId }})

// 添加 | 修改 用户
export const reqAddOrUpdateUser = data => request({ url: `/admin/acl/user/${data.id ? 'update' : 'save'}`, method: data.id ? 'put' : 'post', data })

// 删除用户
export const reqRemoveUser = id => request({ url: `/admin/acl/user/remove/${id}`, method: 'delete' })

// 批量删除用户
export const reqBatchRemoveUser = data => request({ url: `/admin/acl/user/batchRemove`, method: 'delete', data })
