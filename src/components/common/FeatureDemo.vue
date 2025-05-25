<template>
  <div class="feature-demo-page">
    <el-card class="feature-demo-card">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <small>
            <a
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #409eff; text-decoration: none"
            >
              {{ t('features.componentPath', { path }) }}
            </a>
          </small>
        </div>
      </template>

      <p class="component-description">{{ description }}</p>

      <el-divider />

      <!-- 插槽内容 -->
      <slot></slot>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  title: string;
  description: string;
  path: string;
}>();

// 计算GitHub URL
const githubUrl = computed(() => {
  return `https://github.com/pomelo-admin/vue-pomelo-admin/tree/main/${props.path}`;
});
</script>

<style lang="scss" scoped>
.feature-demo-page {
  padding: 5px;
}

.feature-demo-card {
  .card-header {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      font-size: 18px;
      font-weight: bold;
    }

    small {
      font-size: 16px;
      color: #909399;
    }
  }

  .component-description {
    margin-bottom: 20px;
    color: #606266;
  }
}
</style>
