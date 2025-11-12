<template>
  <nav class="fixed-nav" :class="{ 'is-visible': isVisible }">
    <div class="fixed-nav-container">
      <router-link to="/" class="fixed-nav-item">首页</router-link>
      <router-link
        v-for="item in categoryStore.categoryList"
        :key="item.id"
        :to="`/category/${item.id}`"
        class="fixed-nav-item"
      >
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const isVisible = ref(false)

// 处理滚动事件
const handleScroll = () => {
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  isVisible.value = scrollTop > 78
}

onMounted(() => {
  categoryStore.getCategoryList()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.fixed-nav.is-visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.fixed-nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 0 20px;
  height: 60px;
}

.fixed-nav-item {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
  position: relative;
}

.fixed-nav-item:hover {
  color: #27ba9b;
  background: #f0faf8;
}

.fixed-nav-item.router-link-active {
  color: #27ba9b;
}

.fixed-nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: #27ba9b;
  border-radius: 2px;
}
</style>
