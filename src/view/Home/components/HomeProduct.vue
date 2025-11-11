<template>
  <div v-if="goodsList.length" class="home-product">
    <div v-for="category in goodsList" :key="category.id" class="category-section">
      <HomePanel :title="category.name" :sub-title="category.saleInfo">
        <div class="category-content">
          <!-- 左侧分类图片 -->
          <div class="category-cover">
            <img v-lazyload="category.picture" :alt="category.name" />
            <div class="category-children">
              <router-link
                v-for="child in category.children"
                :key="child.id"
                :to="`/category/sub/${child.id}`"
                class="child-link"
              >
                {{ child.name }}
              </router-link>
            </div>
          </div>

          <!-- 右侧商品列表 -->
          <div class="goods-grid">
            <GoodsItem v-for="item in category.goods" :key="item.id" :goods="item" />
          </div>
        </div>
      </HomePanel>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeGoods } from '@/api/home'
import HomePanel from './HomePanel.vue'
import GoodsItem from './GoodsItem.vue'

const goodsList = ref([])

const fetchHomeGoods = async () => {
  try {
    const res = await getHomeGoods()
    if (res.code === '1' && res.result) {
      goodsList.value = res.result
    }
  } catch (error) {
    console.error('获取首页商品失败:', error)
  }
}

onMounted(() => {
  fetchHomeGoods()
})
</script>

<style scoped>
.home-product {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.category-section {
  width: 100%;
}

.category-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}

.category-cover {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.category-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-children {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.child-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.child-link:hover {
  color: #27ba9b;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
