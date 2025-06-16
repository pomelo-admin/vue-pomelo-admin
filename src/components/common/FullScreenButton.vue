<template>
  <div class="fullscreen-button" @click="toggleFullScreen">
    <el-tooltip effect="dark" :content="t('common.fullscreen')" placement="bottom">
      <div class="fullscreen-icon-container">
        <el-icon :size="20" class="fullscreen-icon">
          <FullScreen />
        </el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
</script>

<style lang="scss" scoped>
.fullscreen-button {
  @apply transition-all duration-300 relative overflow-hidden flex items-center justify-center rounded-full p-2 cursor-pointer;

  background: rgb(99 102 241 / 10%);
  border: 1px solid rgb(99 102 241 / 20%);

  &::before {
    content: '';

    @apply absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out;

    background: radial-gradient(circle, rgb(99 102 241 / 20%) 0%, transparent 70%);
  }

  &:hover::before {
    @apply opacity-100;
  }

  &:hover {
    @apply transform scale-110;

    box-shadow: 0 0 8px rgb(99 102 241 / 40%);
  }

  .fullscreen-icon-container {
    @apply flex items-center justify-center relative w-5 h-5 z-10;

    .fullscreen-icon {
      @apply absolute transition-all duration-300 ease-in-out;

      color: #6366f1;
      transform-origin: center;

      &:hover {
        @apply transform scale-110;
      }
    }
  }
}
</style>
