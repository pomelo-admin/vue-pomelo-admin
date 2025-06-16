<template>
  <div class="theme-button" :class="isDark ? 'dark-theme' : 'light-theme'" @click="toggleTheme">
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
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isDark = inject('isDark', false);

const emit = defineEmits(['toggle-theme']);

const toggleTheme = () => {
  emit('toggle-theme');
};
</script>

<style lang="scss" scoped>
.theme-button {
  @apply transition-all duration-300 relative overflow-hidden flex items-center justify-center rounded-full p-2 cursor-pointer;

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

  &:hover {
    @apply transform scale-110;

    box-shadow: 0 0 8px v-bind('isDark ? "rgba(245, 158, 11, 0.4)" : "rgba(99, 102, 241, 0.4)"');
  }

  .theme-icon-container {
    @apply flex items-center justify-center relative w-5 h-5 z-10;

    .theme-icon {
      @apply absolute transition-all duration-300 ease-in-out;

      color: v-bind('isDark ? "#f59e0b" : "#6366f1"');
      transform-origin: center;
    }
  }
}
</style>
