<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse }">
      <div class="logo-container">
        <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-10 h-10 mr-2" />
        <h1 v-if="!isCollapse" class="text-gray-800 dark:text-gray-100">Pomelo Admin</h1>
      </div>
      <el-scrollbar class="sidebar-scrollbar">
        <sidebar />
      </el-scrollbar>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部 -->
      <navbar />

      <!-- 内容区 -->
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import AppMain from './components/AppMain.vue';

const isCollapse = ref(false);
// 提供给子组件
provide('isCollapse', isCollapse);

// 初始化时读取本地存储中的设置
onMounted(() => {
  // 读取菜单折叠状态
  const sidebarStatus = localStorage.getItem('sidebarStatus');
  isCollapse.value = sidebarStatus === '1';
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  @apply relative h-screen w-full flex;

  .sidebar-container {
    @apply h-full flex flex-col transition-all duration-300 ease-in-out z-10;

    width: 220px;

    /* 更稳妥地使用 Tailwind 暗色/浅色背景，避免 v-bind 时序问题 */
    @apply bg-gray-100 dark:bg-slate-800;

    &.is-collapsed {
      width: 64px;

      // 确保弹出菜单正确显示
      :deep(.el-menu--popup) {
        .el-menu-item,
        .el-sub-menu__title {
          span {
            display: inline-block !important;
          }
        }
      }
    }

    .logo-container {
      @apply h-16 flex items-center justify-center p-4;
      @apply bg-gray-100 dark:bg-slate-800;

      h1 {
        @apply text-lg font-bold truncate text-gray-800 dark:text-gray-100;
      }
    }

    // 确保滚动区域背景色一致
    .sidebar-scrollbar {
      @apply flex-1;

      padding: 0;
      margin: 0;

      @apply bg-gray-100 dark:bg-slate-800;

      :deep(.el-scrollbar__view) {
        height: 100%;
      }
    }
  }

  .main-container {
    @apply flex-1 flex flex-col h-full overflow-hidden;
  }
}
</style>
