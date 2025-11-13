<template>
  <div class="cart-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>购物车</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 购物车内容 -->
      <div v-if="cartStore.cartList.length > 0" class="cart-content">
        <!-- 购物车表头 -->
        <div class="cart-header">
          <el-checkbox
            :model-value="cartStore.isAllSelected"
            @change="handleSelectAll"
            class="select-all"
          >
            全选
          </el-checkbox>
          <span class="header-item goods-info">商品信息</span>
          <span class="header-item">单价</span>
          <span class="header-item">数量</span>
          <span class="header-item">小计</span>
          <span class="header-item">操作</span>
        </div>

        <!-- 购物车列表 -->
        <div class="cart-list">
          <div
            v-for="item in cartStore.cartList"
            :key="item.skuId"
            :class="['cart-item', { disabled: !item.isEffective }]"
          >
            <el-checkbox
              :model-value="item.selected"
              :disabled="!item.isEffective"
              @change="cartStore.toggleSelected(item.skuId)"
            />
            <div class="goods-info">
              <router-link :to="`/detail/${item.id}`" class="goods-image">
                <img :src="item.picture" :alt="item.name" />
              </router-link>
              <div class="goods-detail">
                <router-link :to="`/detail/${item.id}`" class="goods-name">
                  {{ item.name }}
                </router-link>
                <p class="goods-attrs">{{ item.attrsText }}</p>
              </div>
            </div>
            <div class="goods-price">¥{{ item.nowPrice }}</div>
            <div class="goods-count">
              <el-input-number
                v-model="item.count"
                :min="1"
                :max="item.stock || 999"
                :disabled="!item.isEffective"
                size="small"
              />
            </div>
            <div class="goods-total">
              ¥{{ (item.count * parseFloat(item.nowPrice)).toFixed(2) }}
            </div>
            <div class="goods-action">
              <el-button link type="danger" @click="handleDelete(item.skuId)">删除</el-button>
            </div>
          </div>
        </div>

        <!-- 购物车底部 -->
        <div class="cart-footer">
          <div class="footer-left">
            <el-checkbox :model-value="cartStore.isAllSelected" @change="handleSelectAll">
              全选
            </el-checkbox>
            <el-button link @click="handleDeleteSelected">删除选中商品</el-button>
          </div>
          <div class="footer-right">
            <div class="total-info">
              <span class="label">已选商品</span>
              <span class="count">{{ cartStore.selectedCount }}</span>
              <span class="label">件</span>
            </div>
            <div class="total-price">
              <span class="label">合计：</span>
              <span class="price">¥{{ cartStore.selectedTotal }}</span>
            </div>
            <el-button type="primary" size="large" @click="handleCheckout"> 去结算 </el-button>
          </div>
        </div>
      </div>

      <!-- 空购物车 -->
      <div v-else class="empty-cart">
        <el-icon :size="120" class="empty-icon">
          <ShoppingCart />
        </el-icon>
        <p>购物车还是空的，快去挑选商品吧~</p>
        <el-button type="primary" @click="$router.push('/')">去首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// 全选/取消全选
const handleSelectAll = (checked) => {
  cartStore.toggleAllSelected(checked)
}

// 删除单个商品
const handleDelete = async (skuId) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await cartStore.delCart([skuId])
  } catch {
    // 用户取消删除
  }
}

// 删除选中商品
const handleDeleteSelected = async () => {
  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${cartStore.selectedCount} 件商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const selectedIds = cartStore.selectedCartList.map((item) => item.skuId)
    await cartStore.delCart(selectedIds)
  } catch {
    // 用户取消删除
  }
}

// 去结算
const handleCheckout = () => {
  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }
  // 跳转到结算页面
  router.push('/checkout')
}

onMounted(async () => {
  console.log('购物车页面加载')
  // 检查是否登录
  if (!userStore.isLogin()) {
    console.log('用户未登录，跳转到登录页')
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  console.log('用户已登录，获取购物车数据')
  // 获取购物车数据
  await cartStore.getCart()
  console.log('购物车数据:', cartStore.cartList)
  console.log('购物车数据长度:', cartStore.cartList.length)
  console.log('cartStore:', cartStore)
})
</script>

<style scoped>
.cart-page {
  background: #f5f5f5;
  min-height: calc(100vh - 140px);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  padding: 15px 0;
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.cart-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.cart-header {
  display: grid;
  grid-template-columns: 50px 1fr 120px 150px 120px 100px;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 500;
  color: #666;
}

.select-all {
  grid-column: 1;
}

.header-item {
  text-align: center;
}

.header-item.goods-info {
  text-align: left;
  padding-left: 20px;
}

.cart-list {
  max-height: 600px;
  overflow-y: auto;
}

.cart-item {
  display: grid;
  grid-template-columns: 50px 1fr 120px 150px 120px 100px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.cart-item:hover {
  background: #fafafa;
}

.cart-item.disabled {
  opacity: 0.5;
}

.goods-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.goods-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e5e5e5;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-detail {
  flex: 1;
  min-width: 0;
}

.goods-name {
  display: block;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-name:hover {
  color: #27ba9b;
}

.goods-attrs {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.goods-price,
.goods-total {
  text-align: center;
  font-size: 16px;
  color: #cf4444;
  font-weight: 500;
}

.goods-count {
  display: flex;
  justify-content: center;
}

.goods-action {
  text-align: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  border-top: 1px solid #e5e5e5;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  font-size: 14px;
  color: #666;
}

.total-info .count {
  color: #27ba9b;
  font-weight: 500;
  margin: 0 4px;
}

.total-price {
  font-size: 14px;
}

.total-price .label {
  color: #666;
}

.total-price .price {
  font-size: 24px;
  color: #cf4444;
  font-weight: bold;
  margin-left: 8px;
}

.empty-cart {
  background: #fff;
  border-radius: 8px;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 20px;
}

.empty-cart p {
  font-size: 16px;
  color: #999;
  margin-bottom: 30px;
}
</style>
