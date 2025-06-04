<template>
  <router-view />
</template>

<script setup lang="ts">
import { useVersionCheck } from '@/utils/version';

// 启用版本检查，当检测到前端部署新版本时会自动通知用户刷新，这里只需要使用到它的副作用而不需要使用到返回值
useVersionCheck();
</script>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
  will-change: filter;

  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  &.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
}
</style>
