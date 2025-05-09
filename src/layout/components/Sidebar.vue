<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      class="sidebar-menu"
      :text-color="isDark ? '#fff' : '#333'"
      active-text-color="#409eff"
      :background-color="isDark ? '#304156' : '#f0f2f5'"
      popper-effect="light"
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
import { useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isCollapse = inject('isCollapse', false);
const isDark = inject('isDark', false);

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
    --el-menu-bg-color: v-bind('isDark ? "#304156" : "#f0f2f5"');

    &:not(.el-menu--collapse) {
      width: 100%;
    }

    :deep(.el-menu) {
      border-right: none;
    }
  }
}
</style>
