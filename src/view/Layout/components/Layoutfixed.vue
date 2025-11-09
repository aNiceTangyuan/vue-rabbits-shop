<template>
  <nav class="fixed-nav" :class="{ 'is-visible': isVisible }">
    <div class="fixed-nav-container">
      <router-link
        v-for="item in categoryStore.categoryList"
        :key="item.id"
        :to="`/category/${item.id}`"
        class="fixed-nav-item"
      >
        <img v-if="item.picture" :src="item.picture" :alt="item.name" class="fixed-category-img" />
        <span class="fixed-category-name">{{ item.name }}</span>
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
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
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
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 2rem;
  height: 60px;
}

.fixed-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 4px;
}

.fixed-nav-item:hover {
  background-color: #f5f5f5;
  color: #2563eb;
}

.fixed-nav-item.router-link-active {
  color: #2563eb;
}

.fixed-category-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.fixed-category-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>

