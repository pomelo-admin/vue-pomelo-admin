<template>
  <el-card class="json-editor-card">
    <template v-if="showHeader" #header>
      <div class="card-header">
        <span>{{ t('features.jsonEditor.title') }}</span>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="formatJSON">
            <el-icon><Check /></el-icon>
            {{ t('features.jsonEditor.format') }}
          </el-button>
          <el-button type="success" size="small" @click="copyJSON">
            <el-icon><DocumentCopy /></el-icon>
            {{ t('features.jsonEditor.copy') }}
          </el-button>
          <el-button type="warning" size="small" @click="clearJSON">
            <el-icon><Delete /></el-icon>
            {{ t('features.jsonEditor.clear') }}
          </el-button>
        </div>
      </div>
    </template>

    <div class="editor-wrapper">
      <div class="editor-container">
        <MonacoEditor
          v-model:value="localContent"
          :options="editorOptions"
          language="json"
          @change="handleChange"
        />
      </div>
      <div class="error-panel" v-if="errorMessage">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Check, DocumentCopy, Delete } from '@element-plus/icons-vue';
import MonacoEditor from './components/MonacoEditor.vue';

// 国际化
const { t } = useI18n();

// 定义属性
const props = defineProps({
  modelValue: {
    type: String,
    default: '{\n  "example": "在此输入您的JSON数据"\n}',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'error', 'valid']);

// 本地内容
const localContent = ref(props.modelValue);
const errorMessage = ref('');

// 监听属性变化，更新本地内容
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== localContent.value) {
      localContent.value = newValue;
    }
  }
);

// 监听本地内容变化，更新父组件值
watch(localContent, newValue => {
  emit('update:modelValue', newValue);
});

// 编辑器配置
const editorOptions = reactive({
  theme: 'vs',
  automaticLayout: true,
  tabSize: 2,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: 'on' as const,
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 7,
  lineNumbersMinChars: 3,
});

// 处理编辑器内容变更
const handleChange = (value: string) => {
  try {
    if (value.trim() === '') {
      errorMessage.value = '';
      emit('valid', true);
      return;
    }

    JSON.parse(value);
    errorMessage.value = '';
    emit('valid', true);
  } catch (e) {
    if (e instanceof Error) {
      errorMessage.value = t('features.jsonEditor.parseError', { message: e.message });
      emit('error', e.message);
      emit('valid', false);
    } else {
      errorMessage.value = t('features.jsonEditor.unknownError');
      emit('error', t('features.jsonEditor.unknownError'));
      emit('valid', false);
    }
  }
};

// 格式化JSON
const formatJSON = () => {
  try {
    if (!localContent.value.trim()) {
      ElMessage.warning(t('features.jsonEditor.formatEmptyWarning'));
      return;
    }

    const obj = JSON.parse(localContent.value);
    localContent.value = JSON.stringify(obj, null, 2);
    ElMessage.success(t('features.jsonEditor.formatSuccess'));
  } catch (e) {
    ElMessage.error(t('features.jsonEditor.formatError'));
  }
};

// 复制JSON内容
const copyJSON = () => {
  if (!localContent.value.trim()) {
    ElMessage.warning(t('features.jsonEditor.copyEmptyWarning'));
    return;
  }

  navigator.clipboard
    .writeText(localContent.value)
    .then(() => {
      ElMessage.success(t('features.jsonEditor.copySuccess'));
    })
    .catch(() => {
      ElMessage.error(t('features.jsonEditor.copyError'));
    });
};

// 清空编辑器
const clearJSON = () => {
  if (localContent.value.trim()) {
    const confirm = window.confirm(t('features.jsonEditor.clearConfirm'));
    if (confirm) {
      localContent.value = '';
      errorMessage.value = '';
      emit('valid', true);
    }
  } else {
    ElMessage.info(t('features.jsonEditor.clearInfo'));
  }
};
</script>

<style lang="scss" scoped>
.json-editor-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .editor-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .editor-container {
      height: 400px;
      overflow: hidden;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }

    .error-panel {
      margin-top: 10px;
    }
  }
}
</style>
