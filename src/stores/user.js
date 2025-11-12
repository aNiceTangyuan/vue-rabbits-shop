import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref('')

  // 从 localStorage 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    const savedToken = localStorage.getItem('token')
    if (savedUserInfo) {
      userInfo.value = JSON.parse(savedUserInfo)
    }
    if (savedToken) {
      token.value = savedToken
    }
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
      if (info.token) {
        token.value = info.token
        localStorage.setItem('token', info.token)
      }
    }
  }

  // 清除用户信息（退出登录）
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  // 判断是否已登录
  const isLogin = () => {
    return !!userInfo.value
  }

  return {
    userInfo,
    token,
    initUserInfo,
    setUserInfo,
    clearUserInfo,
    isLogin,
  }
})
