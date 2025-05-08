<template>
  <div class="navbar-container">
    <!-- 菜单折叠按钮 -->
    <div class="menu-collapse-btn" @click="toggleSidebar">
      <el-tooltip effect="dark" :content="isCollapse ? $t('common.expand') : $t('common.collapse')" placement="bottom">
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
        <el-tooltip effect="dark" :content="$t('common.fullscreen')" placement="bottom">
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
      <div class="right-menu-item cursor-pointer" @click="$emit('toggleTheme')">
        <el-tooltip effect="dark" :content="isDark ? $t('common.lightMode') : $t('common.darkMode')" placement="bottom">
          <el-icon :size="20">
            <Moon v-if="!isDark" />
            <Sunny v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 用户头像 -->
      <el-dropdown trigger="click" class="right-menu-item avatar-container">
        <div class="flex items-center">
          <el-avatar :size="32" :src="userStore.userInfo.avatar || defaultAvatar" />
          <span class="ml-2 hidden sm:inline">{{ userStore.userInfo.username }}</span>
          <el-icon class="ml-1">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon>
                <User />
              </el-icon>
              <span class="ml-1">{{ $t('common.userCenter') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span class="ml-1">{{ $t('common.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/modules/user';
import Breadcrumb from './Breadcrumb.vue';
import LangSwitcher from '@/components/LangSwitcher.vue';
import defaultAvatar from '@/assets/images/default-avatar.png';
import {
  FullScreen, Moon, Sunny, ArrowDown, User, SwitchButton, Fold, Expand
} from '@element-plus/icons-vue';

defineEmits(['toggleTheme']);
const { t } = useI18n();

const isDark = inject('isDark', false);
const isCollapse = inject('isCollapse', false) as any;
const router = useRouter();
const userStore = useUserStore();

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
  await userStore.logout();
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
  }
}
</style>