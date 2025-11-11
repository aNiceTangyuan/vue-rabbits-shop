import http from '@/utils/http'

/**
 * 获取轮播图数据
 * @returns {Promise}
 */
export const getBannerList = () => {
  return http({
    method: 'get',
    url: '/home/banner',
  })
}

/**
 * 获取新鲜好物数据
 * @returns {Promise}
 */
export const getNewGoods = () => {
  return http({
    method: 'get',
    url: '/home/new',
  })
}

/**
 * 获取热门推荐数据
 * @returns {Promise}
 */
export const getHotGoods = () => {
  return http({
    method: 'get',
    url: '/home/hot',
  })
}

/**
 * 获取商品详情
 * @param {string} id - 商品id
 * @returns {Promise}
 */
export const getGoodsDetail = (id) => {
  return http({
    method: 'get',
    url: '/goods',
    params: { id },
  })
}

/**
 * 获取首页商品分类列表
 * @returns {Promise}
 */
export const getHomeGoods = () => {
  return http({
    method: 'get',
    url: '/home/goods',
  })
}
