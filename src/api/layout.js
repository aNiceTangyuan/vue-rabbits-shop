import http from '@/utils/http'

/**
 * 获取分类数据
 * @returns {Promise}
 */
export const getCategoryHead = () => {
  return http({
    method: 'get',
    url: '/home/category/head'
  })
}

