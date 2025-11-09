import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryHead } from '@/api/layout'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref([])
  
  const getCategoryList = async () => {
    try {
      const res = await getCategoryHead()
      if (res.code === '1' && res.result) {
        categoryList.value = res.result
      }
    } catch (error) {
      console.error('获取分类数据失败:', error)
    }
  }

  return { 
    categoryList,
    getCategoryList
  }
})
