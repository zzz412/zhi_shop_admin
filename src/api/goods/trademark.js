import request from '@/utils/request'

// 获取品牌列表
export const reqTrademarkList = (page, limit) => request({ url: `admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 删除品牌列表
export const reqRemoveTrademark = id => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })

// 新增或修改品牌
export const reqAddOrUpdateTrademark = data => {
  if (data.id) {
    // 修改
    return reqUpdateTrademark(data)
  } else {
    // 新增
    return reqAddTrademark(data)
  }
}

// 新增品牌列表
export const reqAddTrademark = data => request({ url: `/admin/product/baseTrademark/save`, method: 'post', data })

// 修改品牌列表
export const reqUpdateTrademark = data => request({ url: `/admin/product/baseTrademark/update`, method: 'put', data })
