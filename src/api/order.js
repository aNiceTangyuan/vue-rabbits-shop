import http from '@/utils/http'

/**
 * 获取结算页信息
 * @returns {Promise}
 */
export const getCheckoutInfo = () => {
  return http({
    url: '/member/order/pre',
    method: 'GET',
  })
}

/**
 * 提交订单
 * @param {Object} data - 订单信息
 * @returns {Promise}
 */
export const createOrder = (data) => {
  return http({
    url: '/member/order',
    method: 'POST',
    data,
  })
}

/**
 * 获取订单详情
 * @param {string} id - 订单ID
 * @returns {Promise}
 */
export const getOrderDetail = (id) => {
  return http({
    url: `/member/order/${id}`,
    method: 'GET',
  })
}

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getOrderList = (params) => {
  return http({
    url: '/member/order',
    method: 'GET',
    params,
  })
}
