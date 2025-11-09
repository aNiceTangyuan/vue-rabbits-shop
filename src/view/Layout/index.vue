<template>
  <div class="layout">
    <LayoutNav />
    <LayoutHeader />
    <Layoutfixed />
    
    <main class="layout-main">
      <router-view />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutNav from './components/LayoutNav.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import Layoutfixed from './components/Layoutfixed.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
}
</style>