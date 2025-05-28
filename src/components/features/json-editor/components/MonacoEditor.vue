<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as monaco from 'monaco-editor';

// 自定义简单的Monaco配置
window.MonacoEnvironment = {
  getWorker() {
    // 内联worker处理脚本以避免加载问题
    const workerCode = `
      self.onmessage = function() {
        // 简化的worker实现
        self.postMessage({ type: 'ready' });
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  },
};

const props = defineProps<{
  value: string;
  language: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'change', value: string): void;
}>();

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// 创建编辑器实例
onMounted(() => {
  if (editorContainer.value) {
    try {
      // 禁用特定语言功能避免加载worker文件
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
      });

      // 对JSON禁用架构验证以避免工作器错误
      if (monaco.languages.json && monaco.languages.json.jsonDefaults) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: false,
          schemas: [],
        });
      }

      // 简化配置初始化编辑器
      const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        value: props.value,
        language: props.language,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        theme: 'vs',
        fontSize: 14,
        tabSize: 2,
        renderLineHighlight: 'all',
        formatOnPaste: true,
        ...props.options,
      };

      editor = monaco.editor.create(editorContainer.value, editorOptions);

      // 监听编辑器内容变化
      editor.onDidChangeModelContent(() => {
        const value = editor?.getValue() || '';
        emit('update:value', value);
        emit('change', value);
      });
    } catch (error) {
      console.error('Monaco Editor initialization error:', error);
    }
  }
});

// 监听props变化，更新编辑器内容
watch(
  () => props.value,
  newValue => {
    if (editor && newValue !== editor.getValue()) {
      editor.setValue(newValue);
    }
  }
);

// 销毁编辑器实例
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
    editor = null;
  }
});
</script>

<style lang="scss" scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
</style>
