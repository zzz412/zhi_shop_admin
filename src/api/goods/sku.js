import request from '@/utils/request'

// 获取SKU列表
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架SKU
export const reqSaleSku = skuId => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 下架SKU
export const reqCancelSaleSku = skuId => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 删除SKU
export const reqDeleteSku = skuId => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })

// 获取SKU详情
export const reqSkuInfo = skuId => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
