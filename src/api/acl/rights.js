import request from '@/utils/request'

// 获取权限列表
export const reqRightsList = () => request({ url: `admin/acl/permission`, method: 'get' })

// 添加 | 修改 权限
export const reqAddOrUpdateRights = data => request({ url: `/admin/acl/permission/${data.id ? 'update' : 'save'}`, method: data.id ? 'put' : 'post', data })

// 删除权限
export const reqRemoveRights = id => request({ url: `/admin/acl/permission/remove/${id}`, method: 'delete' })
