<template>
  <div
    ref="themeButtonRef"
    class="theme-button"
    :class="isDark ? 'dark-theme' : 'light-theme'"
    @click="toggleTheme"
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/store/modules/theme';

const { t } = useI18n();
const theme = useThemeStore();
const isDark = computed(() => theme.isDark);
const themeButtonRef = ref<HTMLElement | null>(null);

const emit = defineEmits(['toggle-theme']);

const toggleTheme = async (event: MouseEvent) => {
  // 检查浏览器是否支持 View Transitions API
  if (!document.startViewTransition) {
    theme.toggle();
    emit('toggle-theme');
    return;
  }

  // 获取按钮位置（右上角）
  const button = themeButtonRef.value;
  if (!button) {
    theme.toggle();
    emit('toggle-theme');
    return;
  }

  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // 计算从按钮位置到页面最远角的距离
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // 使用 View Transitions API
  const transition = document.startViewTransition(async () => {
    theme.toggle();
    emit('toggle-theme');
  });

  // 等待过渡准备就绪
  await transition.ready;

  // 创建圆形扩张动画
  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
    },
    {
      duration: 600,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    }
  );
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
