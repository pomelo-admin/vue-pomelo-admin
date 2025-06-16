<template>
  <div class="navbar-container">
    <!-- 菜单折叠按钮 -->
    <div class="menu-collapse-btn" @click="toggleSidebar">
      <el-tooltip
        effect="dark"
        :content="isCollapse ? t('common.expand') : t('common.collapse')"
        placement="bottom"
      >
        <el-icon :size="20">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </el-tooltip>
    </div>

    <!-- 面包屑 -->
    <breadcrumb class="block ml-2" />

    <div class="flex-1"></div>

    <!-- 右侧菜单 -->
    <div class="right-menu">
      <!-- 语言切换 -->
      <div class="right-menu-item lang-switcher">
        <lang-switcher />
      </div>

      <!-- 全屏按钮 -->
      <div class="right-menu-item">
        <full-screen-button />
      </div>

      <!-- 主题切换 -->
      <div class="right-menu-item">
        <theme-switcher @toggle-theme="$emit('toggleTheme')" />
      </div>

      <!-- 用户头像 -->
      <div class="right-menu-item">
        <user-avatar @show-profile="showUserProfile" />
      </div>
    </div>

    <!-- 用户信息对话框 -->
    <user-profile-dialog v-model:visible="profileDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import Breadcrumb from './Breadcrumb.vue';
import {
  LangSwitcher,
  UserProfileDialog,
  FullScreenButton,
  ThemeSwitcher,
  UserAvatar,
} from '@/components/common';
import { Fold, Expand } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

defineEmits(['toggleTheme']);

const { t } = useI18n();

const isCollapse = inject('isCollapse', false) as any;

// 用户信息对话框控制
const profileDialogVisible = ref(false);

// 显示用户信息对话框
const showUserProfile = () => {
  profileDialogVisible.value = true;
};

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
  // 保存折叠状态到本地存储
  localStorage.setItem('sidebarStatus', isCollapse.value ? '1' : '0');
};
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply h-16 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4;

  .menu-collapse-btn {
    @apply cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mr-2;
  }

  .right-menu {
    @apply flex items-center;

    .right-menu-item {
      @apply mx-3 cursor-pointer rounded-full;
    }

    .lang-switcher {
      padding: 0;
    }
  }
}
</style>
