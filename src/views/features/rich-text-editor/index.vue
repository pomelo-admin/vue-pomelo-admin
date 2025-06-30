<template>
  <FeatureDemo
    :title="t('features.richTextEditor.title', '富文本编辑器')"
    :description="
      t(
        'features.richTextEditor.description',
        '基于wangEditor的富文本编辑器组件，支持自定义工具栏、简洁模式和只读模式'
      )
    "
    path="src/components/features/rich-text-editor"
  >
    <!-- 基础用法 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.richTextEditor.basicUsage') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloRichTextEditor
            v-model="content"
            height="300px"
            :placeholder="t('features.richTextEditor.placeholder')"
          />
        </div>
      </div>
    </el-card>

    <!-- 自定义工具栏 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.richTextEditor.customToolbar') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloRichTextEditor
            v-model="customContent"
            height="250px"
            :placeholder="t('features.richTextEditor.placeholder')"
            :toolbarKeys="customToolbarKeys"
          />
        </div>
      </div>
    </el-card>

    <!-- 简洁模式 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.richTextEditor.simpleMode') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloRichTextEditor
            v-model="simpleContent"
            height="200px"
            mode="simple"
            :placeholder="t('features.richTextEditor.placeholder')"
          />
        </div>
      </div>
    </el-card>

    <!-- 只读模式 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.richTextEditor.readonlyMode') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloRichTextEditor
            v-model="readonlyContent"
            height="200px"
            :readonly="true"
            :placeholder="t('features.richTextEditor.placeholder')"
          />
        </div>
      </div>
    </el-card>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { PomeloRichTextEditor } from '@/components/features';

// 国际化
const { t } = useI18n();

// 基础示例内容
const content = ref('<p>这是一个<strong>富文本编辑器</strong>示例。</p>');

// 自定义工具栏示例
const customContent = ref('');
const customToolbarKeys = ref([
  'headerSelect',
  'bold',
  'italic',
  'underline',
  'through',
  'color',
  'bgColor',
  'bulletedList',
  'numberedList',
  'insertLink',
]);

// 简洁模式示例
const simpleContent = ref('');

// 只读模式示例
const readonlyContent = ref('<p>这是一个<strong>只读</strong>的富文本编辑器示例。</p>');
</script>

<style lang="scss" scoped>
.demo-section {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .demo-component {
      width: 100%;
    }
  }
}
</style>
