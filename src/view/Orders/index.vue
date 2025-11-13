<template>
  <div class="orders-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的订单</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="orders-content">
        <!-- 订单筛选 -->
        <div class="filter-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-item', { active: activeTab === tab.value }]"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </div>
        </div>

        <!-- 订单列表 -->
        <div v-if="orderList.length > 0" class="order-list">
          <div v-for="order in orderList" :key="order.id" class="order-item">
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-time">{{ order.createTime }}</span>
                <span class="order-no">订单号：{{ order.id }}</span>
              </div>
              <div class="order-status">
                <el-tag :type="getStatusType(order.orderState)">
                  {{ getStatusText(order.orderState) }}
                </el-tag>
              </div>
            </div>

            <!-- 订单商品 -->
            <div class="order-goods">
              <div v-for="item in order.skus" :key="item.id" class="goods-item">
                <img :src="item.image" :alt="item.name" class="goods-image" />
                <div class="goods-info">
                  <p class="goods-name">{{ item.name }}</p>
                  <p class="goods-attrs">{{ item.attrsText }}</p>
                </div>
                <div class="goods-price">¥{{ item.curPrice }}</div>
                <div class="goods-count">x{{ item.quantity }}</div>
              </div>
            </div>

            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="order-total">
                <span class="label">实付金额：</span>
                <span class="price">¥{{ order.payMoney }}</span>
              </div>
              <div class="order-actions">
                <el-button size="small" @click="handleViewDetail(order.id)"> 查看详情 </el-button>
                <el-button
                  v-if="order.orderState === 1 && order.countdown > 0"
                  type="primary"
                  size="small"
                  @click="handlePay(order.id)"
                >
                  立即支付
                </el-button>
                <el-button
                  v-if="order.orderState === 1"
                  size="small"
                  @click="handleCancelOrder(order.id)"
                >
                  取消订单
                </el-button>
                <el-button
                  v-if="order.orderState === 3"
                  type="primary"
                  size="small"
                  @click="handleConfirmReceipt(order.id)"
                >
                  确认收货
                </el-button>
                <el-button v-if="order.orderState === 4" type="primary" size="small">
                  评价
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-else-if="!loading" description="暂无订单" />

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <el-icon class="is-loading" :size="40">
            <Loading />
          </el-icon>
          <p>加载中...</p>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { getOrderList } from '@/api/order'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const orderList = ref([])
const activeTab = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单状态标签
const tabs = [
  { label: '全部订单', value: 0 },
  { label: '待付款', value: 1 },
  { label: '待发货', value: 2 },
  { label: '待收货', value: 3 },
  { label: '待评价', value: 4 },
  { label: '已完成', value: 5 },
  { label: '已取消', value: 6 },
]

// 获取订单状态文本
const getStatusText = (state) => {
  const stateMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消',
  }
  return stateMap[state] || '未知'
}

// 获取订单状态类型
const getStatusType = (state) => {
  const typeMap = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'info',
    5: 'success',
    6: 'info',
  }
  return typeMap[state] || 'info'
}

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }
    // 如果不是全部订单，添加状态筛选
    if (activeTab.value !== 0) {
      params.orderState = activeTab.value
    }

    const res = await getOrderList(params)
    console.log('订单列表:', res)
    if (res.code === '1' && res.result) {
      orderList.value = res.result.items || res.result || []
      total.value = res.result.counts || orderList.value.length
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 切换标签
const handleTabChange = (value) => {
  activeTab.value = value
  currentPage.value = 1
  fetchOrderList()
}

// 翻页
const handlePageChange = () => {
  fetchOrderList()
}

// 查看详情
const handleViewDetail = (id) => {
  router.push(`/order/${id}`)
}

// 取消订单
const handleCancelOrder = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // TODO: 调用取消订单接口
    ElMessage.success('订单已取消')
    fetchOrderList()
  } catch {
    // 用户取消操作
  }
}

// 去支付
const handlePay = (id) => {
  router.push(`/pay/${id}`)
}

// 确认收货
const handleConfirmReceipt = async (id) => {
  try {
    await ElMessageBox.confirm('确认已收到商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // TODO: 调用确认收货接口
    ElMessage.success('确认收货成功')
    fetchOrderList()
  } catch {
    // 用户取消操作
  }
}

onMounted(() => {
  // 检查是否登录
  if (!userStore.isLogin()) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  fetchOrderList()
})
</script>

<style scoped>
.orders-page {
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

.orders-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.filter-tabs {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
  position: relative;
}

.tab-item:hover {
  color: #27ba9b;
}

.tab-item.active {
  color: #27ba9b;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: #27ba9b;
}

.order-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.order-no {
  color: #999;
}

.order-goods {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goods-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr;
  align-items: center;
  gap: 20px;
}

.goods-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
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

.goods-price {
  text-align: center;
  font-size: 14px;
  color: #333;
}

.goods-count {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #fafafa;
  border-top: 1px solid #e5e5e5;
}

.order-total {
  font-size: 14px;
}

.order-total .label {
  color: #666;
}

.order-total .price {
  color: #cf4444;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.loading-state {
  padding: 80px 20px;
  text-align: center;
  color: #999;
}

.loading-state p {
  margin-top: 20px;
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 30px 20px;
}
</style>
