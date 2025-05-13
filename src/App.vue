<template>
  <router-view />
</template>

<script setup lang="ts">
import { useVersionCheck } from '@/utils/version';

// 启用版本检查，当检测到前端部署新版本时会自动通知用户刷新
useVersionCheck();
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
