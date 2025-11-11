<template>
  <div class="home-banner">
    <el-carousel height="500px" :interval="3000" arrow="hover">
      <el-carousel-item v-for="item in bannerStore.bannerList" :key="item.id">
        <router-link :to="item.hrefUrl" class="banner-link">
          <img :src="item.imgUrl" :alt="`banner-${item.id}`" class="banner-image" />
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { useBannerStore } from '@/stores/banner'
import { onMounted } from 'vue'

const bannerStore = useBannerStore()

onMounted(() => {
  bannerStore.getBanners()
})
</script>

<style scoped>
.home-banner {
  flex: 1;
  height: 500px;
  border-radius: 0 4px 4px 0;
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
