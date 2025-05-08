<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <!-- 页脚 -->
    <Footer class="app-footer" />
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Footer from '@/components/Footer.vue';

// AppMain组件，用于显示路由内容
const route = useRoute();

// console.log('AppMain mounted, current route:', route.path);
</script>

<style lang="scss" scoped>
.app-main {
  @apply flex-1 p-5 pb-0 overflow-auto relative bg-gray-50 dark:bg-gray-900;

  .app-footer {
    @apply mt-auto py-4;
  }
}

/* 路由过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>