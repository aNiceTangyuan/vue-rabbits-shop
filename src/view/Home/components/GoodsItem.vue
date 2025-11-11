<template>
  <router-link :to="`/product/${goods.id}`" class="goods-item">
    <img v-lazyload="goods.picture" :alt="goods.name" class="goods-image" />
    <div class="goods-info">
      <p class="goods-name">{{ goods.name }}</p>
      <p class="goods-desc">{{ goods.desc }}</p>
      <p class="goods-price">¥{{ goods.price }}</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  goods: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.goods-item {
  display: block;
  text-decoration: none;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.goods-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.goods-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.goods-info {
  padding: 15px;
}

.goods-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-desc {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  margin: 0;
  font-size: 18px;
  color: #cf4444;
  font-weight: bold;
}
</style>
