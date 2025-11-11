<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <div class="hot-list">
      <router-link
        v-for="item in hotGoodsList"
        :key="item.id"
        :to="`/category/${item.id}`"
        class="hot-item"
      >
        <img v-lazyload="item.picture" :alt="item.title" class="hot-image" />
        <div class="hot-info">
          <p class="hot-title">{{ item.title }}</p>
          <p class="hot-alt">{{ item.alt }}</p>
        </div>
      </router-link>
    </div>
  </HomePanel>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHotGoods } from '@/api/home'
import HomePanel from './HomePanel.vue'

const hotGoodsList = ref([])

const fetchHotGoods = async () => {
  try {
    const res = await getHotGoods()
    if (res.code === '1' && res.result) {
      hotGoodsList.value = res.result
    }
  } catch (error) {
    console.error('获取热门推荐失败:', error)
  }
}

onMounted(() => {
  fetchHotGoods()
})
</script>

<style scoped>
.hot-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.hot-item {
  display: block;
  text-decoration: none;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
}

.hot-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.hot-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.hot-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  color: #fff;
}

.hot-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: bold;
}

.hot-alt {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}
</style>
