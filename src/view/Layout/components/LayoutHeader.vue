<template>
  <header class="layout-header">
    <div class="header-logo">
      <img src="@/assets/images/logo.png" alt="Vue Rabbits" />
      <h1>Vue Rabbits</h1>
    </div>
    <nav class="header-nav" v-if="categoryStore.categoryList.length > 0">
      <router-link
        v-for="item in categoryStore.categoryList"
        :key="item.id"
        :to="`/category/${item.id}`"
        class="nav-category"
      >
        <img v-if="item.picture" :src="item.picture" :alt="item.name" class="category-img" />
        <span class="category-name">{{ item.name }}</span>
      </router-link>
    </nav>
    <div class="header-actions">
      <button class="search-btn">
        <Icon icon="material-symbols:search" class="icon-search" />
      </button>
      <button class="user-btn">
        <Icon icon="material-symbols:account-circle" class="icon-user" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.getCategoryList()
})
</script>

<style scoped>
.layout-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.header-logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
  margin: 0 2rem;
}

.nav-category {
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

.nav-category:hover {
  background-color: #f5f5f5;
  color: #2563eb;
}

.nav-category.router-link-active {
  color: #2563eb;
}

.category-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.category-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-btn,
.user-btn {
  width: 40px;
  height: 40px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.search-btn:hover,
.user-btn:hover {
  background-color: #e5e7eb;
}

.icon-search,
.icon-user {
  font-size: 1.5rem;
  color: #666;
}
</style>

