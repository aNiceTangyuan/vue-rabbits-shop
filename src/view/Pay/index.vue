<template>
  <div class="pay-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orders' }">我的订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单支付</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-if="orderDetail" class="pay-content">
        <!-- 支付信息 -->
        <div class="pay-info">
          <div class="info-header">
            <el-icon :size="60" color="#27ba9b">
              <CircleCheck />
            </el-icon>
            <div class="info-text">
              <h2>订单提交成功！</h2>
              <p>请尽快完成支付，超时订单将自动取消</p>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-item">
              <span class="label">订单编号：</span>
              <span class="value">{{ orderDetail.id }}</span>
            </div>
            <div class="summary-item">
              <span class="label">应付金额：</span>
              <span class="price">¥{{ orderDetail.payMoney }}</span>
            </div>
            <div v-if="orderDetail.countdown > 0" class="summary-item">
              <span class="label">剩余时间：</span>
              <span class="countdown">{{ formatCountdown(countdown) }}</span>
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="pay-method">
          <h3>选择支付方式</h3>
          <div class="method-list">
            <div
              :class="['method-item', { active: selectedMethod === 'alipay' }]"
              @click="selectedMethod = 'alipay'"
            >
              <div class="method-icon">
                <img src="https://t.alipayobjects.com/images/T1HHFgXdNnXXXXXXXX.png" alt="支付宝" />
              </div>
              <div class="method-name">支付宝支付</div>
              <el-icon v-if="selectedMethod === 'alipay'" class="check-icon" color="#27ba9b">
                <CircleCheck />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 支付按钮 -->
        <div class="pay-actions">
          <el-button size="large" @click="$router.push('/orders')">返回订单列表</el-button>
          <el-button type="primary" size="large" :loading="paying" @click="handlePay">
            立即支付
          </el-button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, Loading } from '@element-plus/icons-vue'
import { getOrderDetail } from '@/api/order'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const paying = ref(false)
const orderDetail = ref(null)
const selectedMethod = ref('alipay')
const countdown = ref(0)
let timer = null

// 格式化倒计时
const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}分${secs}秒`
}

// 开始倒计时
const startCountdown = () => {
  if (orderDetail.value && orderDetail.value.countdown > 0) {
    countdown.value = orderDetail.value.countdown
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        ElMessage.warning('订单已超时，请重新下单')
        router.push('/orders')
      }
    }, 1000)
  }
}

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.params.id)
    console.log('订单详情:', res)
    if (res.code === '1' && res.result) {
      orderDetail.value = res.result
      // 检查订单状态
      if (res.result.orderState !== 1) {
        ElMessage.warning('订单状态异常')
        router.push(`/order/${route.params.id}`)
        return
      }
      // 开始倒计时
      startCountdown()
    } else {
      ElMessage.error(res.msg || '获取订单详情失败')
      router.push('/orders')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

// 处理支付
const handlePay = () => {
  if (!orderDetail.value) return

  if (countdown.value <= 0) {
    ElMessage.warning('订单已超时，请重新下单')
    router.push('/orders')
    return
  }

  paying.value = true

  // 构建支付宝支付URL
  const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
  const orderId = orderDetail.value.id
  // 回调地址，支付完成后跳转到支付结果页
  const redirectUrl = encodeURIComponent(`${window.location.origin}/#/pay/result`)
  const payUrl = `${baseURL}/pay/aliPay?orderId=${orderId}&redirect=${redirectUrl}`

  console.log('跳转支付宝支付:', payUrl)

  // 跳转到支付宝支付页面
  window.location.href = payUrl
}

onMounted(() => {
  if (route.params.id) {
    fetchOrderDetail()
  } else {
    ElMessage.error('订单ID不存在')
    router.push('/orders')
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.pay-page {
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

.pay-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pay-info {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.info-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.summary-item .label {
  color: #666;
  margin-right: 10px;
  min-width: 100px;
}

.summary-item .value {
  color: #333;
}

.summary-item .price {
  color: #cf4444;
  font-size: 24px;
  font-weight: bold;
}

.summary-item .countdown {
  color: #e6a23c;
  font-size: 18px;
  font-weight: 500;
}

.pay-method {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
}

.pay-method h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.method-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.method-item:hover {
  border-color: #27ba9b;
}

.method-item.active {
  border-color: #27ba9b;
  background: #f0faf8;
}

.method-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon img {
  max-width: 100%;
  max-height: 100%;
}

.method-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.check-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
}

.pay-actions {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
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
