<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <div class="error-message">{{ $t('error.notFound') }}</div>
      <div class="error-desc">{{ $t('error.notFoundDesc') }}</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">{{ $t('error.backHome') }}</el-button>
        <el-button @click="goBack">{{ $t('error.backPrevious') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

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
      @apply text-9xl font-bold text-primary mb-4;
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
