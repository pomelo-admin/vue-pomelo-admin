<template>
  <el-dropdown trigger="click" class="avatar-container">
    <div class="flex items-center">
      <el-avatar :size="32" :src="userInfo.avatar || defaultAvatar" />
      <span class="ml-2 hidden sm:inline">{{ userInfo.username }}</span>
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { ArrowDown, User, SwitchButton } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { computed } from 'vue';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// 用户信息
const userInfo = computed(() => authStore.userInfo);

const emit = defineEmits(['show-profile']);

// 显示用户信息对话框
const showUserProfile = () => {
  emit('show-profile');
};

// 退出登录
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.avatar-container {
  @apply cursor-pointer;
}
</style>
