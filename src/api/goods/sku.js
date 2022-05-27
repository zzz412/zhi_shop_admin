import request from '@/utils/request'

// 获取SKU列表
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
