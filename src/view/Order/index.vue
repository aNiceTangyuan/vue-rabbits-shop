<template>
  <div class="order-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orders' }">我的订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-if="orderDetail" class="order-content">
        <!-- 订单状态 -->
        <div class="status-section">
          <div class="status-info">
            <div class="status-icon">
              <el-icon :size="60" :color="getStatusColor()">
                <component :is="getStatusIcon()" />
              </el-icon>
            </div>
            <div class="status-text">
              <h2>{{ getStatusText() }}</h2>
              <p v-if="orderDetail.orderState === 1 && orderDetail.countdown > 0">
                剩余支付时间：{{ formatCountdown(orderDetail.countdown) }}
              </p>
              <p
                v-if="orderDetail.orderState === 1 && orderDetail.countdown === -1"
                class="timeout"
              >
                订单已超时，请重新下单
              </p>
            </div>
          </div>
          <div
            v-if="orderDetail.orderState === 1 && orderDetail.countdown > 0"
            class="status-actions"
          >
            <el-button type="primary" size="large" @click="handlePay">立即支付</el-button>
            <el-button size="large" @click="$router.push('/orders')">查看订单</el-button>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="section">
          <h3 class="section-title">收货信息</h3>
          <div class="address-info">
            <div class="info-row">
              <span class="label">收货人：</span>
              <span class="value">{{ orderDetail.receiverContact }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系方式：</span>
              <span class="value">{{ orderDetail.receiverMobile }}</span>
            </div>
            <div class="info-row">
              <span class="label">收货地址：</span>
              <span class="value">{{ orderDetail.receiverAddress }}</span>
            </div>
          </div>
        </div>

        <!-- 商品清单 -->
        <div class="section">
          <h3 class="section-title">商品清单</h3>
          <div class="goods-list">
            <div v-for="item in orderDetail.skus" :key="item.id" class="goods-item">
              <img :src="item.image" :alt="item.name" class="goods-image" />
              <div class="goods-info">
                <p class="goods-name">{{ item.name }}</p>
                <p class="goods-attrs">{{ item.attrsText }}</p>
              </div>
              <div class="goods-price">¥{{ item.curPrice }}</div>
              <div class="goods-count">x{{ item.quantity }}</div>
              <div class="goods-total">¥{{ item.realPay }}</div>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="section">
          <h3 class="section-title">订单信息</h3>
          <div class="order-info">
            <div class="info-row">
              <span class="label">订单编号：</span>
              <span class="value">{{ orderDetail.id }}</span>
            </div>
            <div class="info-row">
              <span class="label">下单时间：</span>
              <span class="value">{{ orderDetail.createTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">支付方式：</span>
              <span class="value">{{ getPayTypeText(orderDetail.payType) }}</span>
            </div>
            <div class="info-row">
              <span class="label">配送方式：</span>
              <span class="value">{{ getDeliveryTypeText(orderDetail.deliveryTimeType) }}</span>
            </div>
            <div v-if="orderDetail.payTime" class="info-row">
              <span class="label">支付时间：</span>
              <span class="value">{{ orderDetail.payTime }}</span>
            </div>
            <div v-if="orderDetail.consignTime" class="info-row">
              <span class="label">发货时间：</span>
              <span class="value">{{ orderDetail.consignTime }}</span>
            </div>
          </div>
        </div>

        <!-- 费用明细 -->
        <div class="section">
          <h3 class="section-title">费用明细</h3>
          <div class="price-info">
            <div class="price-row">
              <span class="label">商品总额：</span>
              <span class="value">¥{{ orderDetail.totalMoney }}</span>
            </div>
            <div class="price-row">
              <span class="label">运费：</span>
              <span class="value">¥{{ orderDetail.postFee }}</span>
            </div>
            <div class="price-row total">
              <span class="label">实付金额：</span>
              <span class="value">¥{{ orderDetail.payMoney }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <el-icon class="is-loading" :size="40">
          <Loading />
        </el-icon>
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Loading,
  Clock,
  Box,
  Van,
  ChatDotRound,
  CircleCheck,
  CircleClose,
} from '@element-plus/icons-vue'
import { getOrderDetail } from '@/api/order'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const orderDetail = ref(null)

// 获取订单状态文本
const getStatusText = () => {
  const stateMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消',
  }
  return stateMap[orderDetail.value.orderState] || '未知状态'
}

// 获取订单状态图标
const getStatusIcon = () => {
  const iconMap = {
    1: Clock,
    2: Box,
    3: Van,
    4: ChatDotRound,
    5: CircleCheck,
    6: CircleClose,
  }
  return iconMap[orderDetail.value.orderState] || Clock
}

// 获取订单状态颜色
const getStatusColor = () => {
  const colorMap = {
    1: '#E6A23C',
    2: '#409EFF',
    3: '#409EFF',
    4: '#409EFF',
    5: '#67C23A',
    6: '#909399',
  }
  return colorMap[orderDetail.value.orderState] || '#909399'
}

// 格式化倒计时
const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}分${secs}秒`
}

// 获取支付方式文本
const getPayTypeText = (type) => {
  return type === 1 ? '在线支付' : '货到付款'
}

// 获取配送方式文本
const getDeliveryTypeText = (type) => {
  const typeMap = {
    1: '不限',
    2: '工作日',
    3: '双休或假日',
  }
  return typeMap[type] || '不限'
}

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.params.id)
    console.log('订单详情:', res)
    if (res.code === '1' && res.result) {
      orderDetail.value = res.result
    } else {
      ElMessage.error(res.msg || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 去支付
const handlePay = () => {
  router.push(`/pay/${orderDetail.value.id}`)
}

onMounted(() => {
  if (route.params.id) {
    fetchOrderDetail()
  } else {
    ElMessage.error('订单ID不存在')
    router.push('/orders')
  }
})
</script>

<style scoped>
.order-page {
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
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-section {
  background: #fff;
  border-radius: 8px;
  padding: 40px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.status-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.status-text .timeout {
  color: #f56c6c;
}

.status-actions {
  display: flex;
  gap: 15px;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.address-info,
.order-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  font-size: 14px;
}

.info-row .label {
  color: #666;
  min-width: 100px;
}

.info-row .value {
  color: #333;
  flex: 1;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goods-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr 1fr;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.goods-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.goods-info {
  min-width: 0;
}

.goods-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-attrs {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.goods-price,
.goods-count,
.goods-total {
  text-align: center;
  font-size: 14px;
  color: #333;
}

.goods-total {
  color: #cf4444;
  font-weight: 500;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.price-row {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.price-row .label {
  color: #666;
  margin-right: 20px;
}

.price-row .value {
  color: #333;
  font-weight: 500;
  min-width: 100px;
  text-align: right;
}

.price-row.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
}

.price-row.total .value {
  color: #cf4444;
  font-size: 20px;
  font-weight: bold;
}

.loading-state {
  background: #fff;
  border-radius: 8px;
  padding: 80px 20px;
  text-align: center;
  color: #999;
}

.loading-state p {
  margin-top: 20px;
  font-size: 16px;
}
</style>
