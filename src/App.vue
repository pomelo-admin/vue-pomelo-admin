<template>
  <router-view />
  <floating-chat v-if="showFloatingChat" />
</template>

<script setup lang="ts">
import { useVersionCheck } from '@/utils';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import FloatingChat from '@/components/common/FloatingChat.vue';
import { publicRoutes } from '@/configs';

// 启用版本检查，当检测到前端部署新版本时会自动通知用户刷新，这里只需要使用到它的副作用而不需要使用到返回值
useVersionCheck();

// 获取路由实例
const router = useRouter();

// 控制是否显示悬浮聊天窗口
const showFloatingChat = ref(false);

// 在登录后显示聊天窗口
onMounted(() => {
  // 检查用户是否已登录
  const token = localStorage.getItem('token');
  if (token) {
    showFloatingChat.value = true;
  }

  // 监听路由变化，在非登录/注册页面显示聊天窗口
  router.afterEach((to: RouteLocationNormalized) => {
    showFloatingChat.value = !publicRoutes.includes(to.path);
  });
});
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
