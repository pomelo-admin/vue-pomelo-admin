<template>
  <div class="sidebar">
    <el-menu
      :key="isDark ? 'dark' : 'light'"
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      router
      class="sidebar-menu"
      background-color="transparent"
      :popper-effect="isDark ? 'dark' : 'light'"
      :style="{
        '--el-menu-text-color': isDark ? '#e5e7eb' : '#334155',
        '--el-menu-hover-text-color': isDark ? '#e5e7eb' : '#334155',
        '--el-menu-active-color': '#409eff',
        // 覆盖 Element Plus 通用文字色变量，确保菜单项文字即时变色
        '--el-text-color-regular': isDark ? '#e5e7eb' : '#334155',
        '--el-text-color-secondary': isDark ? '#cbd5e1' : '#64748b',
        '--el-text-color-disabled': isDark ? '#94a3b8' : '#9ca3af',
      }"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isCollapse = inject('isCollapse', false);
const theme = useThemeStore();
const { isDark } = storeToRefs(theme);

// 再次向下级组件提供折叠状态
provide('isCollapse', isCollapse);

// 获取路由
const routes = computed(() => {
  // 过滤掉 hidden: true 的路由
  // console.log(router.options.routes.filter(route => !route.meta?.hidden));
  return router.options.routes.filter(route => !route.meta?.hidden);
});

// 当前活动菜单
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<style lang="scss" scoped>
.sidebar {
  @apply h-full w-full overflow-hidden;

  .sidebar-menu {
    @apply h-full w-full border-none;

    /* 背景和文字颜色：使用 v-bind 确保响应式更新 */
    --el-menu-bg-color: transparent;

    color: v-bind('isDark ? "#e5e7eb" : "#334155"');

    &:not(.el-menu--collapse) {
      width: 100%;
    }

    /* 让 Element Plus 菜单项继承颜色，并移除边框 */
    :deep(.el-menu) {
      background-color: transparent;
      border-right: none;
    }

    /* 强制覆盖菜单项与标题的文字颜色，立即响应主题切换 */
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      color: v-bind('isDark ? "#e5e7eb" : "#334155"') !important;
    }

    :deep(.el-menu--popup .el-menu-item) {
      color: v-bind('isDark ? "#e5e7eb" : "#334155"') !important;
    }

    :deep(.el-menu-item .el-icon),
    :deep(.el-sub-menu__title .el-icon) {
      color: inherit;
    }
  }
}
</style>
