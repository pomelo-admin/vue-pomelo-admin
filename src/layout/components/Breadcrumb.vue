<template>
  <el-breadcrumb class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="index === breadcrumbs.length - 1 || !item.meta?.title" class="no-redirect">{{
          getMenuTitle(item.meta?.title)
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ getMenuTitle(item.meta?.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { RouteLocationMatched } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const breadcrumbs = ref<RouteLocationMatched[]>([]);

/**
 * 获取菜单标题的国际化文本
 */
const getMenuTitle = (title?: string) => {
  if (!title) return '';
  // 尝试从菜单国际化配置中获取，如果没有则使用原始标题
  const hasKey = t(`menu.${title}`);
  if (hasKey !== `menu.${title}`) {
    return t(`menu.${title}`);
  }
  return title;
};

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
    @apply cursor-pointer;
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
