<template>
  <nav class="layout-nav">
    <div class="nav-container">
      <div class="nav-left">
        <span class="welcome-text">
          {{ userStore.isLogin() ? `欢迎，${getUserName()}` : '欢迎来到 Vue Rabbits' }}
        </span>
      </div>
      <div class="nav-right">
        <template v-if="!userStore.isLogin()">
          <router-link to="/login" class="nav-link">请先登录</router-link>
          <span class="divider">|</span>
          <a href="javascript:;" class="nav-link">帮助中心</a>
          <span class="divider">|</span>
          <a href="javascript:;" class="nav-link">关于我们</a>
        </template>
        <template v-else>
          <span class="nav-link user-name">{{ getUserName() }}</span>
          <span class="divider">|</span>
          <router-link to="/member" class="nav-link">会员中心</router-link>
          <span class="divider">|</span>
          <router-link to="/orders" class="nav-link">我的订单</router-link>
          <span class="divider">|</span>
          <button class="nav-link logout-btn" @click="handleLogout">退出登录</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 获取用户名
const getUserName = () => {
  if (userStore.userInfo) {
    return userStore.userInfo.nickname || userStore.userInfo.account || '用户'
  }
  return '用户'
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.clearUserInfo()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {
      // 用户取消退出
    })
}

// 初始化用户信息
onMounted(() => {
  userStore.initUserInfo()
})
</script>

<style scoped>
.layout-nav {
  background: #f5f5f5;
  border-bottom: 1px solid #e5e7eb;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
}

.welcome-text {
  font-size: 13px;
  color: #666;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover {
  color: #27ba9b;
}

.user-name {
  color: #27ba9b;
  font-weight: 500;
  cursor: default;
}

.user-name:hover {
  color: #27ba9b;
}

.divider {
  color: #ddd;
  font-size: 12px;
}
</style>
