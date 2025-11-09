<template>
  <nav class="layout-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-item">
        <Icon icon="material-symbols:home" class="nav-icon" />
        <span>首页</span>
      </router-link>
      <router-link to="/category" class="nav-item">
        <Icon icon="material-symbols:category" class="nav-icon" />
        <span>分类</span>
      </router-link>
      <router-link to="/about" class="nav-item">
        <Icon icon="material-symbols:info" class="nav-icon" />
        <span>关于</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.layout-nav {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
}

.nav-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  text-decoration: none;
  color: #666;
  font-size: 0.95rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #2563eb;
}

.nav-item.router-link-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.nav-icon {
  font-size: 1.3rem;
}

.nav-item span {
  font-weight: 500;
}
</style>

