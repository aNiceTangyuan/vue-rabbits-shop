<template>
  <div class="pay-result-page">
    <div class="container">
      <div class="result-content">
        <el-result
          :icon="paySuccess ? 'success' : 'warning'"
          :title="paySuccess ? '支付成功' : '支付结果确认中'"
          :sub-title="
            paySuccess ? '您的订单已支付成功，感谢您的购买！' : '正在确认支付结果，请稍候...'
          "
        >
          <template #extra>
            <el-button type="primary" size="large" @click="handleViewOrder"> 查看订单 </el-button>
            <el-button size="large" @click="$router.push('/')"> 返回首页 </el-button>
          </template>
        </el-result>

        <div v-if="orderDetail" class="order-info">
          <h3>订单信息</h3>
          <div class="info-item">
            <span class="label">订单编号：</span>
            <span class="value">{{ orderDetail.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付金额：</span>
            <span class="value price">¥{{ orderDetail.payMoney }}</span>
          </div>
          <div v-if="orderDetail.payTime" class="info-item">
            <span class="label">支付时间：</span>
            <span class="value">{{ orderDetail.payTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order'

const route = useRoute()
const router = useRouter()
const paySuccess = ref(false)
const orderDetail = ref(null)

// 查看订单详情
const handleViewOrder = () => {
  if (orderDetail.value) {
    router.push(`/order/${orderDetail.value.id}`)
  } else {
    router.push('/orders')
  }
}

// 检查支付结果
const checkPayResult = async () => {
  // 从URL参数中获取订单ID
  const orderId = route.query.orderId || route.query.id

  if (!orderId) {
    ElMessage.error('订单信息不存在')
    router.push('/orders')
    return
  }

  try {
    // 获取订单详情，检查支付状态
    const res = await getOrderDetail(orderId)
    console.log('支付结果订单详情:', res)

    if (res.code === '1' && res.result) {
      orderDetail.value = res.result

      // 检查订单状态
      // orderState: 1待付款, 2待发货, 3待收货, 4待评价, 5已完成, 6已取消
      if (res.result.orderState === 2 || res.result.orderState === 3) {
        // 已支付（待发货或待收货）
        paySuccess.value = true
      } else if (res.result.orderState === 1) {
        // 还是待付款状态，可能支付未完成
        paySuccess.value = false
        ElMessage.warning('支付未完成，请重新支付')
        setTimeout(() => {
          router.push(`/pay/${orderId}`)
        }, 2000)
      } else {
        // 其他状态
        paySuccess.value = false
      }
    }
  } catch (error) {
    console.error('获取支付结果失败:', error)
    ElMessage.error('获取支付结果失败')
  }
}

onMounted(() => {
  checkPayResult()
})
</script>

<style scoped>
.pay-result-page {
  background: #f5f5f5;
  min-height: calc(100vh - 140px);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.result-content {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
}

.order-info {
  margin-top: 40px;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 8px;
}

.order-info h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.info-item .label {
  color: #666;
  margin-right: 10px;
  min-width: 100px;
}

.info-item .value {
  color: #333;
}

.info-item .price {
  color: #cf4444;
  font-size: 20px;
  font-weight: bold;
}
</style>
