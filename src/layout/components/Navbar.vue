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
      <!-- 全屏按钮 -->
      <div class="right-menu-item" @click="toggleFullScreen">
        <el-tooltip effect="dark" :content="t('common.fullscreen')" placement="bottom">
          <el-icon :size="20">
            <FullScreen />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 语言切换 -->
      <div class="right-menu-item">
        <lang-switcher />
      </div>

      <!-- 主题切换 -->
      <div
        class="right-menu-item cursor-pointer theme-switch"
        :class="isDark ? 'dark-theme' : 'light-theme'"
        @click="$emit('toggleTheme')"
      >
        <el-tooltip
          effect="dark"
          :content="isDark ? t('common.lightMode') : t('common.darkMode')"
          placement="bottom"
        >
          <div class="theme-icon-container">
            <el-icon :size="20" class="theme-icon">
              <Moon v-if="!isDark" />
              <Sunny v-else />
            </el-icon>
          </div>
        </el-tooltip>
      </div>

      <!-- 用户头像 -->
      <el-dropdown trigger="click" class="right-menu-item avatar-container">
        <div class="flex items-center">
          <el-avatar :size="32" :src="authStore.userInfo.avatar || defaultAvatar" />
          <span class="ml-2 hidden sm:inline">{{ authStore.userInfo.username }}</span>
          <el-icon class="ml-1">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showUserProfile">
              <el-icon>
                <User />
              </el-icon>
              <span class="ml-1">{{ t('common.userCenter') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span class="ml-1">{{ t('common.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 用户信息对话框 -->
    <user-profile-dialog v-model:visible="profileDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import Breadcrumb from './Breadcrumb.vue';
import { LangSwitcher, UserProfileDialog } from '@/components/common';
import defaultAvatar from '@/assets/images/default-avatar.png';
import {
  FullScreen,
  Moon,
  Sunny,
  ArrowDown,
  User,
  SwitchButton,
  Fold,
  Expand,
} from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

defineEmits(['toggleTheme']);

const { t } = useI18n();

const isDark = inject('isDark', false);
const isCollapse = inject('isCollapse', false) as any;
const router = useRouter();
const authStore = useAuthStore();

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

// 全屏切换
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// 退出登录
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
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
      @apply mx-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700;
    }

    .avatar-container {
      @apply ml-4;
    }

    .theme-switch {
      @apply transition-all duration-300 relative overflow-hidden;

      background: v-bind('isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(99, 102, 241, 0.1)"');
      border: 1px solid v-bind('isDark ? "rgba(245, 158, 11, 0.2)" : "rgba(99, 102, 241, 0.2)"');

      &::before {
        content: '';

        @apply absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out;
      }

      &.dark-theme::before {
        background: radial-gradient(circle, rgb(245 158 11 / 20%) 0%, transparent 70%);
      }

      &.light-theme::before {
        background: radial-gradient(circle, rgb(99 102 241 / 20%) 0%, transparent 70%);
      }

      &:hover::before {
        @apply opacity-100;
      }

      .theme-icon-container {
        @apply flex items-center justify-center relative w-5 h-5 z-10;

        .theme-icon {
          @apply absolute transition-all duration-300 ease-in-out;

          color: v-bind('isDark ? "#f59e0b" : "#6366f1"');
          transform-origin: center;

          &:hover {
            @apply transform rotate-45;
          }
        }
      }

      &:hover {
        @apply transform scale-110;

        box-shadow: 0 0 8px v-bind('isDark ? "rgba(245, 158, 11, 0.4)" : "rgba(99, 102, 241, 0.4)"');
      }
    }
  }
}
</style>
