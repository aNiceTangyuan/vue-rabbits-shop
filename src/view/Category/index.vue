<template>
  <div v-if="categoryData" class="category-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 分类头部 -->
    <div class="category-header">
      <h2 class="category-title">{{ categoryData.name }}</h2>
    </div>

    <!-- 二级分类列表 -->
    <div v-for="subCategory in categoryData.children" :key="subCategory.id" class="sub-category">
      <!-- 子分类面包屑 -->

      <div class="sub-category-header">
        <h3 class="sub-category-title">{{ subCategory.name }}</h3>
        <router-link :to="`/category/sub/${subCategory.id}`" class="view-more">
          查看全部 >
        </router-link>
      </div>

      <!-- 商品列表 -->
      <div class="goods-list">
        <router-link
          v-for="goods in subCategory.goods"
          :key="goods.id"
          :to="`/product/${goods.id}`"
          class="goods-item"
        >
          <div class="goods-image">
            <img v-lazyload="goods.picture" :alt="goods.name" />
          </div>
          <div class="goods-info">
            <p class="goods-name">{{ goods.name }}</p>
            <p class="goods-desc">{{ goods.desc }}</p>
            <p class="goods-price">¥{{ goods.price }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryDetail } from '@/api/category'

const route = useRoute()
const categoryData = ref(null)

const fetchCategoryData = async () => {
  try {
    const res = await getCategoryDetail(route.params.id)
    if (res.code === '1' && res.result) {
      categoryData.value = res.result
    }
  } catch (error) {
    console.error('获取分类数据失败:', error)
  }
}

onMounted(() => {
  fetchCategoryData()
})

// 监听路由变化，重新获取数据
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      fetchCategoryData()
    }
  },
)
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  padding: 15px 0;
  font-size: 14px;
}

.category-header {
  padding: 20px 0;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 30px;
}

.category-title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.sub-category {
  margin-bottom: 40px;
}

.sub-breadcrumb {
  padding: 10px 0;
  font-size: 12px;
}

.sub-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.sub-category-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.view-more {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.view-more:hover {
  color: #27ba9b;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.goods-item {
  display: block;
  text-decoration: none;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.goods-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.goods-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  padding: 15px;
}

.goods-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-desc {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  margin: 0;
  font-size: 18px;
  color: #cf4444;
  font-weight: bold;
}
</style>
