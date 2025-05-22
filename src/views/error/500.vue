<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">500</h1>
      <div class="error-message">{{ t('error.serverError') }}</div>
      <div class="error-desc">{{ t('error.serverErrorDesc') }}</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">{{ t('error.backHome') }}</el-button>
        <el-button @click="goBack">{{ t('error.backPrevious') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.error-container {
  @apply flex items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-900 overflow-auto;

  .error-content {
    @apply text-center p-10;

    .error-code {
      @apply text-9xl font-bold text-red-500 mb-4;
    }

    .error-message {
      @apply text-2xl font-bold mb-2;
    }

    .error-desc {
      @apply text-gray-500 mb-8;
    }

    .error-actions {
      @apply flex justify-center space-x-4;
    }
  }
}
</style>
