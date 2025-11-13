import http from '@/utils/http'

/**
 * 获取收货地址列表
 * @returns {Promise}
 */
export const getAddressList = () => {
  return http({
    url: '/member/address',
    method: 'GET',
  })
}

/**
 * 新增收货地址
 * @param {Object} data - 地址信息
 * @param {string} data.receiver - 收货人姓名
 * @param {string} data.contact - 收货人联系方式
 * @param {string} data.provinceCode - 省份编码
 * @param {string} data.cityCode - 城市编码
 * @param {string} data.countyCode - 地区编码
 * @param {string} data.address - 详细地址
 * @param {string} data.postalCode - 邮政编码
 * @param {string} data.addressTags - 地址标签（多个用逗号分割）
 * @param {number} data.isDefault - 是否默认地址（0是，1不是）
 * @param {string} data.fullLocation - 完整地址
 * @returns {Promise}
 */
export const addAddress = (data) => {
  return http({
    url: '/member/address',
    method: 'POST',
    data,
  })
}

/**
 * 修改收货地址
 * @param {string} id - 地址ID
 * @param {Object} data - 地址信息
 * @returns {Promise}
 */
export const updateAddress = (id, data) => {
  return http({
    url: `/member/address/${id}`,
    method: 'PUT',
    data,
  })
}

/**
 * 删除收货地址
 * @param {string} id - 地址ID
 * @returns {Promise}
 */
export const deleteAddress = (id) => {
  return http({
    url: `/member/address/${id}`,
    method: 'DELETE',
  })
}

/**
 * 获取地址详情
 * @param {string} id - 地址ID
 * @returns {Promise}
 */
export const getAddressDetail = (id) => {
  return http({
    url: `/member/address/${id}`,
    method: 'GET',
  })
}
