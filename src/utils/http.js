import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const http = axios.create({
  baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 5000,
})

// axios请求拦截器
http.interceptors.request.use(
  (config) => {
    // 获取用户store
    const userStore = useUserStore()

    // 如果用户已登录，在请求头中添加token
    if (userStore.userInfo && userStore.userInfo.token) {
      config.headers.Authorization = `Bearer ${userStore.userInfo.token}`
    }

    return config
  },
  (e) => Promise.reject(e),
)

// axios响应式拦截器
http.interceptors.response.use(
  (res) => res.data,
  (e) => {
    const userStore = useUserStore()

    // 处理401错误 - token失效
    if (e.response && e.response.status === 401) {
      // 清除本地用户信息
      userStore.clearUserInfo()
      // 提示用户
      ElMessage.error('登录已过期，请重新登录')
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(e)
    }

    // 处理其他错误
    const errorMessage = e.response?.data?.message || '请求失败，请稍后重试'
    ElMessage.error(errorMessage)
    console.log(errorMessage)
    return Promise.reject(e)
  },
)

export default http
