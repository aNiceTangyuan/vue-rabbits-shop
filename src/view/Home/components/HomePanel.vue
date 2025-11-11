<template>
  <div class="home-panel">
    <div class="panel-header">
      <h3 class="panel-title">
        {{ title }}
        <small>{{ subTitle }}</small>
      </h3>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.home-panel {
  margin: 20px 0;
}

.panel-header {
  padding: 20px 0;
  border-bottom: 2px solid #f0f0f0;
}

.panel-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.panel-title small {
  margin-left: 10px;
  font-size: 14px;
  font-weight: normal;
  color: #999;
}

.panel-body {
  padding: 20px 0;
}
</style>
