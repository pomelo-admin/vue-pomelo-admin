<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse }">
      <div class="logo-container">
        <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-10 h-10 mr-2" />
        <h1 v-if="!isCollapse">Pomelo Admin</h1>
      </div>
      <el-scrollbar class="sidebar-scrollbar">
        <sidebar />
      </el-scrollbar>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部 -->
      <navbar @toggle-theme="toggleTheme" />

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
const isDark = ref(false); // 默认为浅色模式

// 提供给子组件
provide('isCollapse', isCollapse);
provide('isDark', isDark);

// 初始化时读取本地存储中的设置
onMounted(() => {
  // 读取菜单折叠状态
  const sidebarStatus = localStorage.getItem('sidebarStatus');
  isCollapse.value = sidebarStatus === '1';

  // 读取暗色模式状态
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  // 添加或移除dark类以切换主题
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // 保存主题设置到本地存储
  localStorage.setItem('darkMode', isDark.value.toString());
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  @apply relative h-screen w-full flex;

  .sidebar-container {
    @apply h-full flex flex-col transition-all duration-300 ease-in-out z-10;

    width: 220px;
    background-color: v-bind('isDark ? "#304156" : "#f0f2f5"');

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

      background-color: v-bind('isDark ? "#304156" : "#f0f2f5"');

      h1 {
        @apply text-lg font-bold truncate;

        color: v-bind('isDark ? "#fff" : "#333"');
      }
    }

    // 确保滚动区域背景色一致
    .sidebar-scrollbar {
      @apply flex-1;

      padding: 0;
      margin: 0;
      background-color: v-bind('isDark ? "#304156" : "#f0f2f5"');

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
