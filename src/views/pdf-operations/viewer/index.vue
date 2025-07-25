<template>
  <FeatureDemo
    :title="t('features.pdfViewer.title', 'PDF查看器')"
    :description="
      t('features.pdfViewer.description', '一个功能强大的PDF查看组件，支持分页、旋转、打印等功能')
    "
    path="src/components/features/pdf-viewer"
  >
    <PomeloPdfViewer v-if="src" :src="src" />
    <el-empty v-else :description="t('features.pdfViewer.noSource', '未提供PDF源')" />
  </FeatureDemo>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { PomeloPdfViewer } from '@/components/features';

const { t } = useI18n();

const src = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
</script>

<style lang="scss" scoped>
.pdf-demo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .pdf-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;

    .el-select {
      width: 200px;
    }

    .el-input {
      flex-grow: 1;
    }
  }

  .pdf-viewer-wrapper {
    height: 600px;
    overflow: hidden;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }
}
</style>
