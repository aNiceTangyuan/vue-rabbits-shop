import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getBannerList } from '@/api/home'

export const useBannerStore = defineStore('banner', () => {
  const bannerList = ref([])

  const getBanners = async (distributionSite = '1') => {
    try {
      const res = await getBannerList(distributionSite)
      if (res.code === '1' && res.result) {
        bannerList.value = res.result
      }
    } catch (error) {
      console.error('获取轮播图数据失败:', error)
    }
  }

  return {
    bannerList,
    getBanners,
  }
})
