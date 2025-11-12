import { getSubCategoryAPI } from '@/api/category'

/**
 * 测试获取子分类数据
 * 在浏览器控制台中使用：
 * window.testSubCategory()
 */
export const testSubCategory = async (params = {}) => {
  const defaultParams = {
    categoryId: '1005000',
    page: 1,
    pageSize: 20,
    sortField: 'publishTime',
    ...params,
  }

  console.log('请求参数:', defaultParams)

  try {
    const result = await getSubCategoryAPI(defaultParams)
    console.log('返回结果:', result)
    return result
  } catch (error) {
    console.error('请求失败:', error)
    return error
  }
}

// 挂载到 window 对象，方便在控制台调用
if (typeof window !== 'undefined') {
  window.testSubCategory = testSubCategory
}
