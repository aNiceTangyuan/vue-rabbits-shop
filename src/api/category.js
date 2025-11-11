import http from '@/utils/http'

/**
 * 获取二级分类列表
 * @param {string} id - 一级分类id
 * @returns {Promise}
 */
export const getCategoryDetail = (id) => {
  return http({
    method: 'get',
    url: '/category',
    params: { id },
  })
}
