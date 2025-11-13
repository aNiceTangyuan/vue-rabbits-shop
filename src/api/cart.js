import http from '@/utils/http'

/**
 * 加入购物车
 * @param {string} skuId - 商品sku的id
 * @param {number} count - 商品数量
 * @returns {Promise}
 */
export const addToCart = ({ skuId, count }) => {
  return http({
    url: '/member/cart',
    method: 'POST',
    data: {
      skuId,
      count,
    },
  })
}

/**
 * 获取购物车列表
 * @returns {Promise}
 */
export const getCartList = () => {
  return http({
    url: '/member/cart',
    method: 'GET',
  })
}

/**
 * 删除购物车商品
 * @param {Array<string>} ids - 商品id数组
 * @returns {Promise}
 */
export const deleteCart = (ids) => {
  return http({
    url: '/member/cart',
    method: 'DELETE',
    data: {
      ids,
    },
  })
}

/**
 * 合并购物车
 * @param {Array} data - 购物车数据
 * @returns {Promise}
 */
export const mergeCart = (data) => {
  return http({
    url: '/member/cart/merge',
    method: 'POST',
    data,
  })
}
