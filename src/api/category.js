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

/**
 * 获取导航数据
 * @param {Object} data - 请求参数
 * @param {string} data.categoryId - 分类ID
 * @param {number} data.page - 页码
 * @param {number} data.pageSize - 每页数量
 * @param {string} data.sortField - 排序字段 'publishTime' | 'orderNum' | 'evaluateNum'
 * @returns {Promise}
 */
export const getSubCategoryAPI = (data) => {
  return http({
    method: 'POST',
    url: '/category/goods/temporary',
    data,
  })
}
