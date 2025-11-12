<template>
  <div class="sub-category-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="`/category/${route.params.id}`">
        {{ route.query.parentName || '分类' }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选排序栏 -->
    <div class="filter-bar">
      <div class="filter-left">
        <span class="total-count">共 {{ goodsData.counts }} 件商品</span>
      </div>
      <div class="filter-right">
        <span class="sort-label">排序：</span>
        <el-radio-group v-model="sortField" @change="handleSortChange">
          <el-radio-button label="publishTime">最新</el-radio-button>
          <el-radio-button label="orderNum">销量</el-radio-button>
          <el-radio-button label="evaluateNum">评价</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 商品列表 -->
    <div v-if="goodsData.items && goodsData.items.length" class="goods-section">
      <div class="goods-list">
        <GoodsItem v-for="goods in goodsData.items" :key="goods.id" :goods="goods" />
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="goodsData.counts"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="empty-state">
      <p>暂无商品</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading">
        <span>加载中...</span>
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryAPI } from '@/api/category'
import GoodsItem from '@/view/Home/components/GoodsItem.vue'

const route = useRoute()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const sortField = ref('publishTime')
const goodsData = ref({
  counts: 0,
  pageSize: 20,
  pages: 0,
  page: 1,
  items: [],
})

// 获取商品列表
const fetchGoodsList = async () => {
  loading.value = true
  try {
    const params = {
      categoryId: route.params.id,
      page: currentPage.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
    }

    console.log('请求参数:', params)

    const res = await getSubCategoryAPI(params)

    if (res.code === '1' && res.result) {
      console.log(res)
      goodsData.value = res.result
      console.log('商品数据:', res.result)
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理排序变化
const handleSortChange = (value) => {
  console.log('排序字段改变:', value)
  currentPage.value = 1
  fetchGoodsList()
}

// 处理分页变化
const handlePageChange = () => {
  fetchGoodsList()
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchGoodsList()
})

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      currentPage.value = 1
      fetchGoodsList()
    }
  },
)
</script>

<style scoped>
.sub-category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  padding: 15px 0;
  font-size: 14px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-left {
  display: flex;
  align-items: center;
}

.total-count {
  font-size: 14px;
  color: #666;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 14px;
  color: #666;
}

.goods-section {
  padding: 20px 0;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 16px;
}
</style>
