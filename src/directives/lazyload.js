import { useIntersectionObserver } from '@vueuse/core'

export default {
  mounted(el, binding) {
    // 保存原始图片地址
    const imgSrc = binding.value

    // 使用 vueuse 的 useIntersectionObserver 监听元素是否进入视口
    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 当元素进入视口时，加载图片
          el.src = imgSrc

          // 图片加载成功后停止观察
          el.onerror = () => {
            // 加载失败时可以设置默认图片
            el.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3E加载失败%3C/text%3E%3C/svg%3E'
          }

          el.onload = () => {
            // 加载成功后停止观察
            stop()
          }
        }
      },
      {
        threshold: 0.01,
      },
    )
  },
}
