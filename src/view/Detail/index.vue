<template>
  <div v-if="goodsDetail" class="detail-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(cat, index) in goodsDetail.categories"
        :key="cat.id"
        :to="index === 0 ? `/category/${cat.id}` : ''"
      >
        {{ cat.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ goodsDetail.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品主要信息 -->
    <div class="goods-main">
      <!-- 左侧图片区 -->
      <div class="goods-gallery">
        <div
          class="main-image"
          @mouseenter="showZoom = true"
          @mouseleave="handleMouseLeave"
          @mousemove="handleMouseMove"
        >
          <img :src="currentImage" :alt="goodsDetail.name" />
          <!-- 遮罩层 -->
          <div v-if="showZoom" class="zoom-mask" :style="maskStyle"></div>
        </div>
        <!-- 放大镜显示区域 -->
        <div v-if="showZoom" class="zoom-preview">
          <img :src="currentImage" :alt="goodsDetail.name" :style="zoomStyle" />
        </div>
        <div class="thumbnail-list">
          <div
            v-for="(img, index) in goodsDetail.mainPictures"
            :key="index"
            :class="['thumbnail-item', { active: currentImage === img }]"
            @mouseenter="handleThumbnailHover(img)"
            @click="handleThumbnailClick(img)"
          >
            <img :src="img" :alt="`${goodsDetail.name}-${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 右侧信息区 -->
      <div class="goods-info">
        <h1 class="goods-name">{{ goodsDetail.name }}</h1>
        <p class="goods-desc">{{ goodsDetail.desc }}</p>

        <!-- 品牌信息 -->
        <div v-if="goodsDetail.brand" class="brand-info">
          <img
            v-if="goodsDetail.brand.logo"
            :src="goodsDetail.brand.logo"
            :alt="goodsDetail.brand.name"
          />
          <span>{{ goodsDetail.brand.name }}</span>
        </div>

        <!-- 价格信息 -->
        <div class="price-box">
          <div class="price-item">
            <span class="label">价格</span>
            <span class="current-price">¥{{ goodsDetail.price }}</span>
            <span v-if="goodsDetail.oldPrice !== goodsDetail.price" class="old-price">
              ¥{{ goodsDetail.oldPrice }}
            </span>
          </div>
          <div class="stats">
            <span>销量：{{ goodsDetail.salesCount }}</span>
            <span>评论：{{ goodsDetail.commentCount }}</span>
            <span>收藏：{{ goodsDetail.collectCount }}</span>
          </div>
        </div>

        <!-- 规格选择 -->
        <div v-if="goodsDetail.specs && goodsDetail.specs.length" class="specs-section">
          <div v-for="spec in goodsDetail.specs" :key="spec.id" class="spec-group">
            <div class="spec-label">{{ spec.name }}</div>
            <div class="spec-values">
              <div
                v-for="value in spec.values"
                :key="value.name"
                :class="['spec-value', { active: selectedSpecs[spec.name] === value.name }]"
                @click="selectSpec(spec.name, value.name)"
              >
                <img v-if="value.picture" :src="value.picture" :alt="value.name" />
                <span>{{ value.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <span class="label">数量</span>
          <el-input-number v-model="quantity" :min="1" :max="goodsDetail.inventory" />
          <span class="stock-info">库存：{{ goodsDetail.inventory }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="handleAddCart">加入购物车</el-button>
          <el-button size="large" @click="handleBuyNow">立即购买</el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="goods-detail-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div class="detail-content">
            <div v-if="goodsDetail.details.properties" class="properties">
              <h3>商品属性</h3>
              <table class="properties-table">
                <tr v-for="prop in goodsDetail.details.properties" :key="prop.name">
                  <td class="prop-name">{{ prop.name }}</td>
                  <td class="prop-value">{{ prop.value }}</td>
                </tr>
              </table>
            </div>
            <div v-if="goodsDetail.details.pictures" class="detail-images-section">
              <el-collapse v-model="activeCollapse">
                <el-collapse-item title="查看详情图片" name="images">
                  <div class="detail-images">
                    <img
                      v-for="(img, index) in goodsDetail.details.pictures"
                      :key="index"
                      v-lazyload="img"
                      :alt="`详情图-${index + 1}`"
                    />
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品评价" name="comment">
          <div v-if="goodsDetail.evaluationInfo" class="evaluation-content">
            <div class="evaluation-summary">
              <div class="score">{{ goodsDetail.evaluationInfo.score }}</div>
              <div class="praise-count">{{ goodsDetail.evaluationInfo.praiseCount }} 人点赞</div>
            </div>
            <div class="evaluation-item">
              <p class="content">{{ goodsDetail.evaluationInfo.content }}</p>
              <p class="time">{{ goodsDetail.evaluationInfo.createTime }}</p>
            </div>
          </div>
          <div v-else class="empty-evaluation">
            <p>暂无评价</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 相似商品推荐 -->
    <div
      v-if="goodsDetail.similarProducts && goodsDetail.similarProducts.length"
      class="recommend-section"
    >
      <h3 class="section-title">相似商品推荐</h3>
      <div class="goods-list">
        <GoodsItem v-for="item in goodsDetail.similarProducts" :key="item.id" :goods="item" />
      </div>
    </div>

    <!-- 24小时热销 -->
    <div v-if="goodsDetail.hotByDay && goodsDetail.hotByDay.length" class="recommend-section">
      <h3 class="section-title">24小时热销</h3>
      <div class="goods-list">
        <GoodsItem v-for="item in goodsDetail.hotByDay" :key="item.id" :goods="item" />
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else-if="loading" class="loading-state">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGoodsDetail } from '@/api/home'
import GoodsItem from '@/view/Home/components/GoodsItem.vue'

const route = useRoute()
const loading = ref(false)
const goodsDetail = ref(null)
const currentImage = ref('')
const selectedSpecs = ref({})
const quantity = ref(1)
const activeTab = ref('detail')
const showZoom = ref(false)
const maskStyle = ref({})
const zoomStyle = ref({})
const activeCollapse = ref([]) // 默认收起，空数组表示不展开任何项

// 获取商品详情
const fetchGoodsDetail = async () => {
  loading.value = true
  try {
    const res = await getGoodsDetail(route.params.id)
    if (res.code === '1' && res.result) {
      console.log(res)
      goodsDetail.value = res.result
      currentImage.value = res.result.mainPictures[0]
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择规格
const selectSpec = (specName, valueName) => {
  selectedSpecs.value[specName] = valueName
}

// 加入购物车
const handleAddCart = () => {
  console.log('加入购物车', {
    goods: goodsDetail.value,
    specs: selectedSpecs.value,
    quantity: quantity.value,
  })
  // TODO: 实现加入购物车逻辑
}

// 立即购买
const handleBuyNow = () => {
  console.log('立即购买', {
    goods: goodsDetail.value,
    specs: selectedSpecs.value,
    quantity: quantity.value,
  })
  // TODO: 实现立即购买逻辑
}

// 处理鼠标移动（放大镜效果）
const handleMouseMove = (e) => {
  // 使用 currentTarget 获取绑定事件的容器，而不是触发事件的元素
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()

  // 计算鼠标相对于容器的位置
  const offsetX = e.clientX - rect.left
  const offsetY = e.clientY - rect.top
  const { offsetWidth, offsetHeight } = container

  // 遮罩层大小
  const maskSize = 150
  const halfMask = maskSize / 2

  // 计算遮罩层位置（限制在图片范围内）
  let left = offsetX - halfMask
  let top = offsetY - halfMask

  if (left < 0) left = 0
  if (top < 0) top = 0
  if (left > offsetWidth - maskSize) left = offsetWidth - maskSize
  if (top > offsetHeight - maskSize) top = offsetHeight - maskSize

  // 设置遮罩层样式
  maskStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${maskSize}px`,
    height: `${maskSize}px`,
  }

  // 计算放大图片的位置（2倍放大）
  const scale = 2
  const bgLeft = -left * scale
  const bgTop = -top * scale

  zoomStyle.value = {
    width: `${offsetWidth * scale}px`,
    height: `${offsetHeight * scale}px`,
    left: `${bgLeft}px`,
    top: `${bgTop}px`,
  }
}

// 处理鼠标离开
const handleMouseLeave = () => {
  showZoom.value = false
  maskStyle.value = {}
  zoomStyle.value = {}
}

// 处理缩略图 hover
const handleThumbnailHover = (img) => {
  currentImage.value = img
}

// 处理缩略图点击
const handleThumbnailClick = (img) => {
  currentImage.value = img
}

onMounted(() => {
  fetchGoodsDetail()
})

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      fetchGoodsDetail()
    }
  },
)
</script>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  padding: 15px 0;
  font-size: 14px;
}

.goods-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
}

.goods-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
  position: relative;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.zoom-mask {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid #27ba9b;
  pointer-events: none;
  z-index: 10;
}

.zoom-preview {
  position: absolute;
  left: 105%;
  top: 0;
  width: 400px;
  height: 400px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.zoom-preview img {
  position: absolute;
  max-width: none;
  max-height: none;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e5e5e5;
  transition: all 0.3s;
}

.thumbnail-item:hover {
  border-color: #27ba9b;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(39, 186, 155, 0.3);
}

.thumbnail-item.active {
  border-color: #27ba9b;
  box-shadow: 0 2px 8px rgba(39, 186, 155, 0.3);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goods-name {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.goods-desc {
  margin: 0;
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.brand-info img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}

.brand-info span {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.price-box {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.price-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.label {
  font-size: 14px;
  color: #666;
}

.current-price {
  font-size: 28px;
  color: #cf4444;
  font-weight: bold;
}

.old-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.specs-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.spec-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-value {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-value:hover {
  border-color: #27ba9b;
}

.spec-value.active {
  border-color: #27ba9b;
  background: #f0faf8;
  color: #27ba9b;
}

.spec-value img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stock-info {
  font-size: 14px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.goods-detail-section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.detail-content {
  padding: 20px 0;
}

.properties {
  margin-bottom: 30px;
}

.properties h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.properties-table {
  width: 100%;
  border-collapse: collapse;
}

.properties-table tr {
  border-bottom: 1px solid #f0f0f0;
}

.properties-table td {
  padding: 12px;
  font-size: 14px;
}

.prop-name {
  width: 150px;
  color: #999;
}

.prop-value {
  color: #333;
}

.detail-images-section {
  margin-top: 20px;
}

.detail-images {
  padding: 10px 0;
}

.detail-images img {
  width: 100%;
  display: block;
  margin-bottom: 10px;
  border-radius: 4px;
}

.evaluation-content {
  padding: 20px 0;
}

.evaluation-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.score {
  font-size: 48px;
  font-weight: bold;
  color: #27ba9b;
}

.praise-count {
  font-size: 14px;
  color: #666;
}

.evaluation-item {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.evaluation-item .content {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.evaluation-item .time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.empty-evaluation {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 14px;
}

.recommend-section {
  margin-bottom: 40px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.loading-state {
  text-align: center;
  padding: 100px 20px;
  color: #999;
  font-size: 16px;
}
</style>
