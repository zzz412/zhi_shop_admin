import request from '@/utils/request'

// 获取角色列表
export const reqRoleList = (page, limit, params) => request({ url: `admin/acl/role/${page}/${limit}`, method: 'get', params })

// 获取角色权限列表
export const reqRoleRightList = id => request({ url: `/admin/acl/permission/toAssign/${id}`, method: 'get' })

// 设置角色权限
export const reqSaveRoleRight = (roleId, permissionId) => request({ url: `/admin/acl/permission/doAssign`, method: 'post', params: { roleId, permissionId }})

// 添加 | 修改 角色
export const reqAddOrUpdateRole = data => request({ url: `/admin/acl/role/${data.id ? 'update' : 'save'}`, method: data.id ? 'put' : 'post', data })

// 删除角色
export const reqRemoveRole = id => request({ url: `/admin/acl/role/remove/${id}`, method: 'delete' })

// 批量删除角色
export const reqBatchRemoveRole = data => request({ url: `/admin/acl/role/batchRemove`, method: 'delete', data })
