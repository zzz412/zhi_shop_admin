import request from '@/utils/request'

// 获取品牌列表
export const reqTrademarkList = (page, limit) => request({ url: `admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 删除品牌列表
export const reqRemoveTrademark = id => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
