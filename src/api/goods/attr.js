import request from '@/utils/request'

// 获取一级分类
export const reqCategory1 = () => request({ url: `/admin/product/getCategory1`, method: 'get' })

// 获取二级分类
export const reqCategory2 = id => request({ url: `/admin/product/getCategory2/${id}`, method: 'get' })

// 获取三级分类
export const reqCategory3 = id => request({ url: `/admin/product/getCategory3/${id}`, method: 'get' })

// 获取属性列表
export const reqAttrList = ({ category1Id, category2Id, category3Id }) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 新增||修改属性
export const reqAddOrUpdateAttr = data => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })

// 删除属性
export const reqDeleteAttr = id => request({ url: `/admin/product/deleteAttr/${id}`, method: 'delete' })
