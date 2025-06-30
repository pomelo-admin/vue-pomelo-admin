<template>
  <FeatureDemo
    :title="t('features.codeEditor.title', '代码编辑器')"
    :description="
      t(
        'features.codeEditor.description',
        '基于 CodeMirror 的代码编辑器组件，支持多种编程语言和主题，提供代码高亮、格式化和复制功能'
      )
    "
    path="src/components/features/code-editor"
  >
    <!-- 基础用法 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.codeEditor.basicUsage', '基础用法') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloCodeEditor
            v-model:value="jsCode"
            language="javascript"
            height="300px"
            :placeholder="t('features.codeEditor.placeholder', '请输入代码...')"
          />
        </div>
      </div>
    </el-card>

    <!-- 只读模式 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.codeEditor.readonlyMode', '只读模式') }}</span>
        </div>
      </template>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloCodeEditor
            v-model:value="readonlyCode"
            language="javascript"
            height="200px"
            :readonly="true"
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
import { PomeloCodeEditor } from '@/components/features';

// 国际化
const { t } = useI18n();

// JavaScript 示例代码
const jsCode = ref(`// JavaScript 示例
function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

const num = 5;
console.log(\`\${num}的阶乘是: \${calculateFactorial(num)}\`);
`);

// 只读代码示例
const readonlyCode = ref(`// 这是一个只读的代码示例
// 您不能编辑此代码块

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(router)
   .use(store)
   .use(i18n)
   .use(ElementPlus)
   .mount('#app');
`);
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
