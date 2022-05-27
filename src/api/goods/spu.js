import request from '@/utils/request'

// 获取SPU列表
export const reqSpuList = (page, limit, id) => request({ url: `/admin/product/${page}/${limit}?category3Id=${id}`, method: 'get' })

// 获取品牌列表
export const reqTrademark = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取销售属性列表
export const reqAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 新增 或 修改SPU
export const reqAddOrSaveSpu = data => {
  if (data.id) {
    return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data })
  } else {
    return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data })
  }
}

// 获取SPU详情
export const reqSpuInfo = id => request({ url: `/admin/product/getSpuById/${id}`, method: 'get' })

// 获取SPU图片列表
export const reqSpuImageList = id => request({ url: `/admin/product/spuImageList/${id}`, method: 'get' })

// 获取SPU的销售属性
export const reqSpuSaleList = id => request({ url: `/admin/product/spuSaleAttrList/${id}`, method: 'get' })

// 新增SKU
export const reqAddSku = data => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data })

// 删除SPU
export const reqDeleteSpu = id => request({ url: `/admin/product/deleteSpu/${id}`, method: 'delete' })

// 获取SKU列表
export const reqSkuList = id => request({ url: `/admin/product/findBySpuId/${id}`, method: 'get' })

