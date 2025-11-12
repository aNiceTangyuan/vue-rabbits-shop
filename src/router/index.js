import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由滚动行为定制
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/view/Layout/index.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/view/Home/index.vue'),
        },
        {
          path: 'category/:id',
          name: 'Category',
          component: () => import('@/view/Category/index.vue'),
        },
        {
          path: 'category/sub/:id',
          name: 'SubCategory',
          component: () => import('@/view/SubCategory/index.vue'),
        },
        {
          path: 'product/:id',
          name: 'Detail',
          component: () => import('@/view/Detail/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/view/Login/index.vue'),
    },
  ],
})

export default router
