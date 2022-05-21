import request from '@/utils/request'

// 获取SPU列表
export const reqSpuList = (page, limit, id) => request({ url: `/admin/product/${page}/${limit}?category3Id=${id}`, method: 'get' })
