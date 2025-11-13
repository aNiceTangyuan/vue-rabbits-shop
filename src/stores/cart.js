import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addToCart, getCartList, deleteCart } from '@/api/cart'
import { ElMessage } from 'element-plus'

export const useCartStore = defineStore('cart', () => {
  // 购物车列表
  const cartList = ref([])

  // 购物车商品总数
  const cartCount = computed(() => {
    return cartList.value.reduce((total, item) => total + item.count, 0)
  })

  // 选中商品列表
  const selectedCartList = computed(() => {
    return cartList.value.filter((item) => item.selected)
  })

  // 选中商品总数
  const selectedCount = computed(() => {
    return selectedCartList.value.reduce((total, item) => total + item.count, 0)
  })

  // 选中商品总价
  const selectedTotal = computed(() => {
    return selectedCartList.value
      .reduce((total, item) => total + item.count * parseFloat(item.nowPrice), 0)
      .toFixed(2)
  })

  // 是否全选
  const isAllSelected = computed(() => {
    return cartList.value.length > 0 && cartList.value.every((item) => item.selected)
  })

  // 获取购物车列表
  const getCart = async () => {
    console.log('开始获取购物车列表')
    try {
      const res = await getCartList()
      console.log('购物车列表响应:', res)
      if (res.code === '1') {
        cartList.value = res.result || []
        console.log(cartList.value)
      } else {
        console.error('获取购物车列表失败，返回码:', res.code, '消息:', res.msg)
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
    }
  }

  // 添加到购物车
  const addCart = async ({ skuId, count }) => {
    console.log('开始添加购物车:', { skuId, count })
    try {
      const res = await addToCart({ skuId, count })
      console.log('添加购物车响应:', res)
      if (res.code === '1') {
        ElMessage.success('添加购物车成功')
        // 重新获取购物车列表
        await getCart()
      } else {
        ElMessage.error(res.msg || '添加购物车失败')
      }
    } catch (error) {
      console.error('添加购物车失败:', error)
      // 错误已经在拦截器中处理，这里不再重复提示
    }
  }

  // 删除购物车商品
  const delCart = async (ids) => {
    try {
      const res = await deleteCart(ids)
      if (res.code === '1') {
        ElMessage.success('删除成功')
        // 重新获取购物车列表
        await getCart()
      }
    } catch (error) {
      console.error('删除购物车商品失败:', error)
      ElMessage.error('删除失败')
    }
  }

  // 切换商品选中状态
  const toggleSelected = (skuId) => {
    const item = cartList.value.find((item) => item.skuId === skuId)
    if (item) {
      item.selected = !item.selected
    }
  }

  // 全选/取消全选
  const toggleAllSelected = (selected) => {
    cartList.value.forEach((item) => {
      item.selected = selected
    })
  }

  // 清空购物车
  const clearCart = () => {
    cartList.value = []
  }

  return {
    cartList,
    cartCount,
    selectedCartList,
    selectedCount,
    selectedTotal,
    isAllSelected,
    getCart,
    addCart,
    delCart,
    toggleSelected,
    toggleAllSelected,
    clearCart,
  }
})
