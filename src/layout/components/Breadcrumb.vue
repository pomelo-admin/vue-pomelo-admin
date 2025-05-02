<template>
  <el-breadcrumb class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="index === breadcrumbs.length - 1 || !item.meta?.title" class="no-redirect">{{ item.meta?.title
          }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationMatched } from 'vue-router';

const route = useRoute();
const router = useRouter();
const breadcrumbs = ref<RouteLocationMatched[]>([]);

const getBreadcrumbs = () => {
  // 过滤掉没有 meta.title 的路由
  const matched = route.matched.filter(item => item.meta && item.meta.title);
  breadcrumbs.value = matched;
};

// 导航到对应路由
const handleLink = (item: RouteLocationMatched) => {
  const { path } = item;
  router.push(path);
};

// 监听路由变化
watch(
  () => route.path,
  () => getBreadcrumbs(),
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  @apply inline-block;

  .no-redirect {
    @apply text-gray-400 cursor-text;
  }

  a {
    @apply text-primary hover:text-primary cursor-pointer;
  }
}

// 面包屑动画
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>