<template>
  <FeatureDemo
    :title="t('features.jsonEditor.title')"
    :description="t('features.jsonEditor.description')"
    path="src/components/features/json-editor"
  >
    <JsonEditor v-model="jsonContent" />
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { JsonEditor } from '@/components/features';

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
