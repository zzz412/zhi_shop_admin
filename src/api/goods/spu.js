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
