<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <div class="goods-list">
      <GoodsItem v-for="item in newGoodsList" :key="item.id" :goods="item" />
    </div>
  </HomePanel>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNewGoods } from '@/api/home'
import HomePanel from './HomePanel.vue'
import GoodsItem from './GoodsItem.vue'

const newGoodsList = ref([])

const fetchNewGoods = async () => {
  try {
    const res = await getNewGoods()
    if (res.code === '1' && res.result) {
      newGoodsList.value = res.result
    }
  } catch (error) {
    console.error('获取新鲜好物失败:', error)
  }
}

onMounted(() => {
  fetchNewGoods()
})
</script>

<style scoped>
.goods-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
