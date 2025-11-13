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

      <!-- 右侧功能区 -->
      <div class="header-actions">
        <!-- 搜索图标 -->
        <div class="search-icon-box">
          <el-icon :size="24" class="action-icon">
            <Search />
          </el-icon>
        </div>

        <!-- 购物车 -->
        <router-link to="/cart" class="cart-link">
          <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99">
            <el-icon :size="24" class="cart-icon">
              <ShoppingCart />
            </el-icon>
          </el-badge>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import { Search, ShoppingCart } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const categoryStore = useCategoryStore()
const cartStore = useCartStore()
const userStore = useUserStore()

// 购物车数量
const cartCount = computed(() => cartStore.cartCount)

onMounted(() => {
  categoryStore.getCategoryList()
  // 如果用户已登录，获取购物车数据
  if (userStore.isLogin()) {
    cartStore.getCart()
  }
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-icon-box {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-icon-box:hover {
  background: #f0faf8;
}

.action-icon {
  color: #333;
  transition: color 0.3s;
}

.search-icon-box:hover .action-icon {
  color: #27ba9b;
}

.cart-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.cart-link:hover {
  background: #f0faf8;
}

.cart-icon {
  color: #333;
  transition: color 0.3s;
}

.cart-link:hover .cart-icon {
  color: #27ba9b;
}

.cart-link :deep(.el-badge__content) {
  background-color: #27ba9b;
  border: none;
}
</style>
