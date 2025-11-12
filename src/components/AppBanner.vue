<template>
  <div class="app-banner" :style="{ height: height }">
    <el-carousel :height="height" :interval="3000" arrow="hover">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <router-link :to="item.hrefUrl" class="banner-link">
          <img v-lazyload="item.imgUrl" :alt="`banner-${item.id}`" class="banner-image" />
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBannerList } from '@/api/home'

const props = defineProps({
  distributionSite: {
    type: String,
    default: '1',
  },
  height: {
    type: String,
    default: '500px',
  },
})

const bannerList = ref([])

const fetchBanners = async () => {
  try {
    const res = await getBannerList(props.distributionSite)
    if (res.code === '1' && res.result) {
      bannerList.value = res.result
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<style scoped>
.app-banner {
  width: 100%;
  overflow: hidden;
}

.banner-link {
  display: block;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.el-carousel) {
  height: 100%;
}

:deep(.el-carousel__container) {
  height: 100%;
}
</style>
