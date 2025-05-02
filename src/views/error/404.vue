<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <div class="error-message">页面找不到了</div>
      <div class="error-desc">抱歉，您访问的页面不存在或已被删除</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
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
  @apply h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900;

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