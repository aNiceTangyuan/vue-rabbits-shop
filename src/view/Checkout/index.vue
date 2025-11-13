<template>
  <div class="checkout-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/cart' }">购物车</el-breadcrumb-item>
        <el-breadcrumb-item>结算</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-if="checkoutInfo" class="checkout-content">
        <!-- 收货地址 -->
        <div class="section address-section">
          <div class="section-header">
            <h3 class="section-title">收货地址</h3>
            <el-button type="primary" size="small" @click="handleAddAddress"> 新增地址 </el-button>
          </div>
          <div
            v-if="checkoutInfo.userAddresses && checkoutInfo.userAddresses.length > 0"
            class="address-list"
          >
            <div
              v-for="item in checkoutInfo.userAddresses"
              :key="item.id"
              :class="['address-item', { active: selectedAddressId === item.id }]"
              @click="selectedAddressId = item.id"
            >
              <div class="address-info">
                <div class="address-header">
                  <span class="receiver">{{ item.receiver }}</span>
                  <span class="contact">{{ item.contact }}</span>
                  <el-tag v-if="item.isDefault === 0" type="success" size="small">默认</el-tag>
                </div>
                <div class="address-detail">{{ item.fullLocation }} {{ item.address }}</div>
              </div>
              <div class="address-actions">
                <el-icon v-if="selectedAddressId === item.id" class="check-icon" color="#27ba9b">
                  <CircleCheck />
                </el-icon>
                <el-button link size="small" @click.stop="handleEditAddress(item)">
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click.stop="handleDeleteAddress(item.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          <div v-else class="empty-address">
            <p>暂无收货地址，请先添加地址</p>
          </div>
        </div>

        <!-- 地址表单对话框 -->
        <el-dialog
          v-model="addressDialogVisible"
          :title="isEditAddress ? '编辑地址' : '新增地址'"
          width="600px"
        >
          <el-form
            ref="addressFormRef"
            :model="addressForm"
            :rules="addressRules"
            label-width="100px"
          >
            <el-form-item label="收货人" prop="receiver">
              <el-input v-model="addressForm.receiver" placeholder="请输入收货人姓名" />
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="addressForm.contact" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="所在地区" prop="fullLocation">
              <el-input
                v-model="addressForm.fullLocation"
                placeholder="请输入省市区，如：北京市 北京市 朝阳区"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="addressForm.address"
                type="textarea"
                :rows="3"
                placeholder="请输入详细地址"
              />
            </el-form-item>
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="addressForm.postalCode" placeholder="请输入邮政编码" />
            </el-form-item>
            <el-form-item label="地址标签" prop="addressTags">
              <el-input
                v-model="addressForm.addressTags"
                placeholder="如：家、公司（多个用逗号分隔）"
              />
            </el-form-item>
            <el-form-item label="设为默认">
              <el-switch v-model="isDefaultAddress" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="addressDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmitAddress">确定</el-button>
          </template>
        </el-dialog>

        <!-- 商品列表 -->
        <div class="section goods-section">
          <h3 class="section-title">商品清单</h3>
          <div class="goods-list">
            <div class="goods-header">
              <span class="col-goods">商品信息</span>
              <span class="col-price">单价</span>
              <span class="col-count">数量</span>
              <span class="col-total">小计</span>
            </div>
            <div v-for="item in checkoutInfo.goods" :key="item.skuId" class="goods-item">
              <div class="goods-info">
                <img :src="item.picture" :alt="item.name" />
                <div class="goods-detail">
                  <p class="goods-name">{{ item.name }}</p>
                  <p class="goods-attrs">{{ item.attrsText }}</p>
                </div>
              </div>
              <div class="goods-price">¥{{ item.price }}</div>
              <div class="goods-count">x{{ item.count }}</div>
              <div class="goods-total">¥{{ item.totalPayPrice }}</div>
            </div>
          </div>
        </div>

        <!-- 订单备注 -->
        <div class="section remark-section">
          <h3 class="section-title">订单备注</h3>
          <el-input
            v-model="buyerMessage"
            type="textarea"
            :rows="3"
            placeholder="选填，请先和商家协商一致"
            maxlength="200"
            show-word-limit
          />
        </div>

        <!-- 结算信息 -->
        <div class="section summary-section">
          <div class="summary-content">
            <div class="summary-item">
              <span class="label">商品件数：</span>
              <span class="value">{{ checkoutInfo.summary.goodsCount }} 件</span>
            </div>
            <div class="summary-item">
              <span class="label">商品总价：</span>
              <span class="value">¥{{ checkoutInfo.summary.totalPrice }}</span>
            </div>
            <div class="summary-item">
              <span class="label">运费：</span>
              <span class="value">¥{{ checkoutInfo.summary.postFee }}</span>
            </div>
            <div v-if="checkoutInfo.summary.discountPrice > 0" class="summary-item">
              <span class="label">优惠：</span>
              <span class="value discount">-¥{{ checkoutInfo.summary.discountPrice }}</span>
            </div>
            <div class="summary-total">
              <span class="label">应付总额：</span>
              <span class="price">¥{{ checkoutInfo.summary.totalPayPrice }}</span>
            </div>
          </div>
          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="submitting"
            @click="handleSubmit"
          >
            提交订单
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Loading } from '@element-plus/icons-vue'
import { getCheckoutInfo, createOrder } from '@/api/order'
import { addAddress, updateAddress, deleteAddress } from '@/api/address'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const submitting = ref(false)
const checkoutInfo = ref(null)
const selectedAddressId = ref('')
const buyerMessage = ref('')

// 地址管理相关
const addressDialogVisible = ref(false)
const isEditAddress = ref(false)
const addressFormRef = ref(null)
const currentEditAddressId = ref('')
const isDefaultAddress = ref(false)

// 地址表单数据
const addressForm = reactive({
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  address: '',
  postalCode: '',
  addressTags: '',
  fullLocation: '',
})

// 地址表单验证规则
const addressRules = {
  receiver: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  fullLocation: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

// 获取结算信息
const fetchCheckoutInfo = async () => {
  loading.value = true
  try {
    const res = await getCheckoutInfo()
    if (res.code === '1' && res.result) {
      checkoutInfo.value = res.result
      // 默认选中第一个默认地址或第一个地址
      if (res.result.userAddresses && res.result.userAddresses.length > 0) {
        const defaultAddr = res.result.userAddresses.find((item) => item.isDefault === 0)
        selectedAddressId.value = defaultAddr ? defaultAddr.id : res.result.userAddresses[0].id
      }
    }
  } catch (error) {
    console.error('获取结算信息失败:', error)
    ElMessage.error('获取结算信息失败')
  } finally {
    loading.value = false
  }
}

// 重置地址表单
const resetAddressForm = () => {
  addressForm.receiver = ''
  addressForm.contact = ''
  addressForm.provinceCode = ''
  addressForm.cityCode = ''
  addressForm.countyCode = ''
  addressForm.address = ''
  addressForm.postalCode = ''
  addressForm.addressTags = ''
  addressForm.fullLocation = ''
  isDefaultAddress.value = false
  currentEditAddressId.value = ''
  if (addressFormRef.value) {
    addressFormRef.value.clearValidate()
  }
}

// 新增地址
const handleAddAddress = () => {
  resetAddressForm()
  isEditAddress.value = false
  addressDialogVisible.value = true
}

// 编辑地址
const handleEditAddress = (item) => {
  resetAddressForm()
  isEditAddress.value = true
  currentEditAddressId.value = item.id
  addressForm.receiver = item.receiver
  addressForm.contact = item.contact
  addressForm.provinceCode = item.provinceCode || ''
  addressForm.cityCode = item.cityCode || ''
  addressForm.countyCode = item.countyCode || ''
  addressForm.address = item.address
  addressForm.postalCode = item.postalCode || ''
  addressForm.addressTags = item.addressTags || ''
  addressForm.fullLocation = item.fullLocation
  isDefaultAddress.value = item.isDefault === 0
  addressDialogVisible.value = true
}

// 删除地址
const handleDeleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await deleteAddress(id)
    if (res.code === '1') {
      ElMessage.success('删除成功')
      // 重新获取结算信息
      await fetchCheckoutInfo()
    }
  } catch {
    // 用户取消删除
  }
}

// 提交地址表单
const handleSubmitAddress = async () => {
  if (!addressFormRef.value) return

  await addressFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...addressForm,
        isDefault: isDefaultAddress.value ? 0 : 1,
        // 简单处理地区编码，实际项目中应该使用地区选择器
        provinceCode: addressForm.provinceCode || '110000',
        cityCode: addressForm.cityCode || '110100',
        countyCode: addressForm.countyCode || '110101',
      }

      try {
        let res
        if (isEditAddress.value) {
          res = await updateAddress(currentEditAddressId.value, data)
        } else {
          res = await addAddress(data)
        }

        if (res.code === '1') {
          ElMessage.success(isEditAddress.value ? '修改成功' : '添加成功')
          addressDialogVisible.value = false
          resetAddressForm()
          // 重新获取结算信息
          await fetchCheckoutInfo()
        }
      } catch (error) {
        console.error('地址操作失败:', error)
      }
    }
  })
}

// 提交订单
const handleSubmit = async () => {
  // 检查是否选择了地址
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  // 检查是否有商品
  if (!checkoutInfo.value.goods || checkoutInfo.value.goods.length === 0) {
    ElMessage.warning('购物车没有商品')
    return
  }

  submitting.value = true
  try {
    // 构建订单数据，严格按照接口文档格式
    const orderData = {
      deliveryTimeType: 1, // 配送时间类型，默认为1
      payType: 1, // 支付方式，默认为1（在线支付）
      payChannel: 1, // 支付渠道，默认为1（支付宝支付）
      buyerMessage: buyerMessage.value || '', // 买家备注留言，默认为空字符串
      goods: checkoutInfo.value.goods.map((item) => ({
        skuId: item.skuId,
        count: item.count,
      })),
      addressId: selectedAddressId.value, // 收货地址id
    }

    console.log('提交订单数据:', orderData)

    const res = await createOrder(orderData)
    console.log('订单提交响应:', res)

    if (res.code === '1') {
      ElMessage.success('订单提交成功')
      // 跳转到订单详情或订单列表页面
      if (res.result && res.result.id) {
        router.push(`/order/${res.result.id}`)
      } else {
        router.push('/orders')
      }
    } else {
      ElMessage.error(res.msg || '订单提交失败')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error('订单提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 检查是否登录
  if (!userStore.isLogin()) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  fetchCheckoutInfo()
})
</script>

<style scoped>
.checkout-page {
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

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 地址部分 */
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-item:hover {
  border-color: #27ba9b;
}

.address-item.active {
  border-color: #27ba9b;
  background: #f0faf8;
}

.address-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.receiver {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.contact {
  font-size: 14px;
  color: #666;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.check-icon {
  font-size: 24px;
}

.empty-address {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* 商品列表 */
.goods-list {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.goods-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 15px 20px;
  background: #f5f5f5;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.goods-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.goods-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.goods-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.goods-detail {
  flex: 1;
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

/* 结算信息 */
.summary-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.summary-content {
  flex: 1;
}

.summary-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-item .label {
  color: #666;
  margin-right: 10px;
}

.summary-item .value {
  color: #333;
  font-weight: 500;
}

.summary-item .discount {
  color: #27ba9b;
}

.summary-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.summary-total .label {
  font-size: 16px;
  color: #333;
  margin-right: 10px;
}

.summary-total .price {
  font-size: 24px;
  color: #cf4444;
  font-weight: bold;
}

.submit-btn {
  width: 200px;
  height: 50px;
  font-size: 16px;
  margin-left: 30px;
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
