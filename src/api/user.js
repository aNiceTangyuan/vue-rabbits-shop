import http from '@/utils/http'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.account - 用户名或手机号
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export const userLogin = (data) => {
  return http({
    method: 'POST',
    url: '/login',
    data,
  })
}
