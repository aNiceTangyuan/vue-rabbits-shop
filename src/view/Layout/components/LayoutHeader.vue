<template>
  <header class="layout-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="header-logo">
        <router-link to="/">
          <img src="@/assets/images/logo.png" alt="Vue Rabbits" />
          <h1>Vue Rabbits</h1>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <!-- 首页 -->
        <router-link to="/" class="nav-item">首页</router-link>

        <!-- 分类导航 -->
        <router-link
          v-for="item in categoryStore.categoryList"
          :key="item.id"
          :to="`/category/${item.id}`"
          class="nav-item"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.getCategoryList()
})
</script>

<style scoped>
.layout-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.header-logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.header-logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #27ba9b;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  margin: 0 40px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-item:hover {
  color: #27ba9b;
  background: #f0faf8;
}

.nav-item.router-link-active {
  color: #27ba9b;
  background: #f0faf8;
}
</style>
