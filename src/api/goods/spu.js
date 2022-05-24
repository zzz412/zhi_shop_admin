import request from '@/utils/request'

// 获取SPU列表
export const reqSpuList = (page, limit, id) => request({ url: `/admin/product/${page}/${limit}?category3Id=${id}`, method: 'get' })

// 获取品牌列表
export const reqTrademark = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取销售属性列表
export const reqAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })
