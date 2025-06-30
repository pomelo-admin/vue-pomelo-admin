<template>
  <FeatureDemo
    :title="t('features.jsonVisualizer.title')"
    :description="t('features.jsonVisualizer.description')"
    path="src/components/features/json-visualizer"
  >
    <div class="json-split-view">
      <div class="editor-panel">
        <PomeloJsonEditor v-model="jsonContent" />
      </div>
      <div class="visualizer-panel">
        <PomeloJsonVisualizer :model-value="jsonContent" />
      </div>
    </div>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { PomeloJsonEditor, PomeloJsonVisualizer } from '@/components/features';

const { t } = useI18n();
const jsonContent = ref(`{
  "user": {
    "id": 1001,
    "name": "张三",
    "email": "zhangsan@example.com",
    "active": true,
    "roles": ["admin", "editor"],
    "preferences": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      },
      "language": "zh-CN"
    }
  },
  "products": [
    {
      "id": "p-001",
      "name": "高级套餐",
      "price": 199.99,
      "features": ["无限存储", "优先支持", "API访问"],
      "available": true
    },
    {
      "id": "p-002",
      "name": "基础套餐",
      "price": 99.99,
      "features": ["10GB存储", "标准支持"],
      "available": false
    }
  ],
  "stats": {
    "visits": 10542,
    "conversions": 1250,
    "conversionRate": 0.1185
  },
  "lastUpdated": "2023-09-15T08:30:45Z"
}`);
</script>

<style scoped>
.json-split-view {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.editor-panel,
.visualizer-panel {
  flex: 1;
  min-width: 0; /* 防止flex项目溢出 */
}

@media (width <= 768px) {
  .json-split-view {
    flex-direction: column;
  }
}
</style>
