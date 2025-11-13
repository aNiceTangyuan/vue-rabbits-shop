import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAddressList, addAddress, updateAddress, deleteAddress } from '@/api/address'
import { ElMessage } from 'element-plus'

export const useAddressStore = defineStore('address', () => {
  // 地址列表
  const addressList = ref([])

  // 默认地址
  const defaultAddress = computed(() => {
    return addressList.value.find((item) => item.isDefault === 0)
  })

  // 获取地址列表
  const getAddress = async () => {
    try {
      const res = await getAddressList()
      if (res.code === '1') {
        addressList.value = res.result || []
      }
    } catch (error) {
      console.error('获取地址列表失败:', error)
    }
  }

  // 新增地址
  const addNewAddress = async (data) => {
    try {
      const res = await addAddress(data)
      if (res.code === '1') {
        ElMessage.success('添加地址成功')
        // 重新获取地址列表
        await getAddress()
        return true
      } else {
        ElMessage.error(res.msg || '添加地址失败')
        return false
      }
    } catch (error) {
      console.error('添加地址失败:', error)
      return false
    }
  }

  // 修改地址
  const editAddress = async (id, data) => {
    try {
      const res = await updateAddress(id, data)
      if (res.code === '1') {
        ElMessage.success('修改地址成功')
        // 重新获取地址列表
        await getAddress()
        return true
      } else {
        ElMessage.error(res.msg || '修改地址失败')
        return false
      }
    } catch (error) {
      console.error('修改地址失败:', error)
      return false
    }
  }

  // 删除地址
  const delAddress = async (id) => {
    try {
      const res = await deleteAddress(id)
      if (res.code === '1') {
        ElMessage.success('删除地址成功')
        // 重新获取地址列表
        await getAddress()
        return true
      } else {
        ElMessage.error(res.msg || '删除地址失败')
        return false
      }
    } catch (error) {
      console.error('删除地址失败:', error)
      return false
    }
  }

  return {
    addressList,
    defaultAddress,
    getAddress,
    addNewAddress,
    editAddress,
    delAddress,
  }
})
