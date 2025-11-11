<template>
  <div class="home-category">
    <div v-for="item in categoryStore.categoryList" :key="item.id" class="category-item">
      <router-link :to="`/category/${item.id}`" class="category-link">
        {{ item.name }}
      </router-link>

      <!-- 悬浮显示的详情面板 -->
      <div class="category-panel">
        <div class="panel-content">
          <!-- 子分类 -->
          <div v-if="item.children && item.children.length" class="panel-section">
            <h4 class="section-title">分类</h4>
            <div class="children-list">
              <router-link
                v-for="child in item.children"
                :key="child.id"
                :to="`/category/sub/${child.id}`"
                class="child-item"
              >
                <img :src="child.picture" :alt="child.name" class="child-image" />
                <span class="child-name">{{ child.name }}</span>
              </router-link>
            </div>
          </div>

          <!-- 商品推荐 -->
          <div v-if="item.goods && item.goods.length" class="panel-section">
            <h4 class="section-title">推荐商品</h4>
            <div class="goods-list">
              <router-link
                v-for="good in item.goods"
                :key="good.id"
                :to="`/product/${good.id}`"
                class="goods-item"
              >
                <img :src="good.picture" :alt="good.name" class="goods-image" />
                <div class="goods-info">
                  <p class="goods-name">{{ good.name }}</p>
                  <p class="goods-price">¥{{ good.price }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/category'
import { onMounted } from 'vue'

const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.getCategoryList()
})
</script>

<style scoped>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  position: relative;
  z-index: 10;
  border-radius: 4px 0 0 4px;
}

.category-item {
  padding: 12px 20px;
  position: relative;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.category-item:hover .category-panel {
  display: block;
}

.category-link {
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  transition: color 0.3s;
  display: block;
}

.category-link:hover {
  color: #27ba9b;
}

/* 悬浮面板 */
.category-panel {
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  width: 500px;
  background: #fff;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 100;
  margin-left: 1px;
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 20px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* 子分类列表 */
.children-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.child-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.child-item:hover {
  background-color: #f5f5f5;
}

.child-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 5px;
}

.child-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 商品列表 */
.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.goods-item {
  display: flex;
  text-decoration: none;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.goods-item:hover {
  background-color: #f5f5f5;
}

.goods-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.goods-name {
  font-size: 12px;
  color: #333;
  margin: 0 0 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-price {
  font-size: 14px;
  color: #cf4444;
  font-weight: bold;
  margin: 0;
}
</style>
