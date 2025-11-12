import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/common.scss'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import lazyload from './directives/lazyload'

// 导入测试API（开发环境）
if (import.meta.env.DEV) {
  import('./utils/testApi')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册图片懒加载指令
app.directive('lazyload', lazyload)

app.mount('#app')
