<template>
  <div class="code-editor-container" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="code-editor-toolbar">
      <div class="left-actions">
        <el-select v-model="currentLanguage" placeholder="选择语言" size="small">
          <el-option
            v-for="lang in LANGUAGE_OPTIONS"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          />
        </el-select>
        <el-select v-model="currentTheme" placeholder="选择主题" size="small">
          <el-option
            v-for="theme in THEME_OPTIONS"
            :key="theme.value"
            :label="theme.label"
            :value="theme.value"
          />
        </el-select>
      </div>
      <div class="right-actions">
        <el-tooltip content="格式化代码" v-if="!props.readonly && !props.disabled">
          <el-button size="small" @click="formatCode">
            <el-icon><Edit /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="复制代码">
          <el-button size="small" @click="copyCode" :disabled="props.disabled">
            <el-icon><DocumentCopy /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'">
          <el-button size="small" @click="toggleFullscreen">
            <el-icon>
              <component :is="isFullscreen ? Close : FullScreen" />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="code-editor-content" :style="editorStyle">
      <Codemirror
        ref="cmEditor"
        v-model:value="code"
        :options="editorOptions"
        :height="isFullscreen ? '100%' : props.height"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        border
        @ready="onEditorReady"
        @focus="onEditorFocus"
        @blur="onEditorBlur"
        @change="onEditorChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Codemirror from 'codemirror-editor-vue3';
import './codemirror-imports';
import type { CodeEditorProps, CodeEditorEmits } from './types';
import {
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
  DEFAULT_FONT_SIZE,
  DEFAULT_TAB_SIZE,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
} from './constants';
import { ElMessage } from 'element-plus';
import { Edit, DocumentCopy, FullScreen, Close } from '@element-plus/icons-vue';

const props = withDefaults(defineProps<CodeEditorProps>(), {
  value: '',
  language: 'javascript',
  theme: 'default',
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WIDTH,
  fontSize: DEFAULT_FONT_SIZE,
  lineNumbers: true,
  readonly: false,
  disabled: false,
  lineWrapping: true,
  tabSize: DEFAULT_TAB_SIZE,
  showToolbar: true,
  placeholder: '请输入代码...',
});

// 定义组件事件
const emit = defineEmits<CodeEditorEmits>();

// 组件状态
const cmEditor = ref();
const code = ref(props.value);
const currentLanguage = ref(props.language);
const currentTheme = ref(props.theme);
const isFullscreen = ref(false);

// 编辑器配置
const editorOptions = computed(() => ({
  mode: currentLanguage.value,
  theme: currentTheme.value,
  tabSize: props.tabSize,
  lineNumbers: props.lineNumbers,
  lineWrapping: props.lineWrapping,
  readOnly: props.readonly || props.disabled,
  autoCloseBrackets: true,
  autoCloseTags: true,
  matchBrackets: true,
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  styleActiveLine: true,
  extraKeys: {
    'Ctrl-Space': 'autocomplete',
    Tab: (cm: any) => {
      if (cm.somethingSelected()) {
        cm.indentSelection('add');
      } else {
        cm.replaceSelection(' '.repeat(cm.getOption('tabSize')), 'end');
      }
    },
  },
}));

// 编辑器样式
const editorStyle = computed(() => ({
  width: props.width,
}));

// 编辑器就绪事件
const onEditorReady = (editor: any) => {
  // 保存编辑器实例
  cmEditor.value = editor;

  try {
    // 设置字体大小
    if (editor.getWrapperElement) {
      editor.getWrapperElement().style.fontSize = `${props.fontSize}px`;
    }

    // 添加快捷键处理
    if (editor.setOption && editor.getOption) {
      editor.setOption('extraKeys', {
        ...editor.getOption('extraKeys'),
        'Ctrl-S': (cm: any) => {
          emit('save', cm.getValue());
        },
        'Cmd-S': (cm: any) => {
          emit('save', cm.getValue());
        },
      });
    }

    // 触发 ready 事件
    emit('ready', editor);
  } catch (error) {
    console.error('Editor ready error:', error);
  }
};

// 编辑器焦点事件
const onEditorFocus = () => {
  emit('focus');
};

// 编辑器失焦事件
const onEditorBlur = () => {
  emit('blur');
};

// 编辑器内容变化事件
const onEditorChange = (value: string) => {
  emit('update:value', value);
  emit('change', value);
};

// 格式化代码
const formatCode = () => {
  if (props.readonly || props.disabled || !cmEditor.value) return;

  try {
    // 直接使用当前组件绑定的代码值
    const currentCode = code.value;
    if (!currentCode) return;

    // 根据不同语言进行基本的缩进处理
    let formattedCode = currentCode;

    // 根据语言进行不同的格式化处理
    switch (currentLanguage.value) {
      case 'javascript':
      case 'text/javascript':
      case 'js':
        // JavaScript 格式化
        formattedCode = formatJavaScript(currentCode);
        break;
      case 'html':
      case 'text/html':
        // HTML 格式化
        formattedCode = formatHTML(currentCode);
        break;
      case 'css':
      case 'text/css':
        // CSS 格式化
        formattedCode = formatCSS(currentCode);
        break;
      case 'json':
      case 'application/json':
        // JSON 格式化
        formattedCode = formatJSON(currentCode);
        break;
      default:
        // 默认格式化 - 简单的缩进处理
        formattedCode = formatIndentation(currentCode);
    }

    // 更新代码值
    code.value = formattedCode;

    ElMessage.success('代码格式化成功');
    emit('format', formattedCode);
  } catch (error) {
    console.error('Format code error:', error);
    ElMessage.error('代码格式化失败');
  }
};

// JavaScript 格式化
const formatJavaScript = (code: string): string => {
  try {
    // 简单的 JavaScript 格式化
    // 1. 将多个空行合并为一个空行
    let formatted = code.replace(/\n\s*\n\s*\n/g, '\n\n');

    // 2. 处理缩进 - 这里使用简单算法，实际项目中可以集成 prettier
    formatted = formatIndentation(formatted);

    return formatted;
  } catch (error) {
    console.error('JavaScript format error:', error);
    return code;
  }
};

// HTML 格式化
const formatHTML = (code: string): string => {
  try {
    // 简单的 HTML 格式化
    // 1. 将标签后面添加换行
    let formatted = code.replace(/>\s*</g, '>\n<');

    // 2. 处理缩进
    formatted = formatIndentation(formatted);

    return formatted;
  } catch (error) {
    console.error('HTML format error:', error);
    return code;
  }
};

// CSS 格式化
const formatCSS = (code: string): string => {
  try {
    // 简单的 CSS 格式化
    // 1. 在 { 后和 } 前添加换行
    let formatted = code.replace(/\{\s*/g, '{\n  ').replace(/\s*\}/g, '\n}');

    // 2. 在每个属性后添加换行
    formatted = formatted.replace(/;\s*/g, ';\n  ');

    // 3. 处理缩进
    formatted = formatIndentation(formatted);

    return formatted;
  } catch (error) {
    console.error('CSS format error:', error);
    return code;
  }
};

// JSON 格式化
const formatJSON = (code: string): string => {
  try {
    // 解析 JSON 并格式化
    const obj = JSON.parse(code);
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    console.error('JSON format error:', error);
    return code;
  }
};

// 通用缩进格式化
const formatIndentation = (code: string): string => {
  try {
    const lines = code.split('\n');
    let indentLevel = 0;
    const tabSize = props.tabSize || 2;
    const indentChar = ' ';

    const formattedLines = lines.map(line => {
      // 去除行首尾空白
      const trimmedLine = line.trim();

      // 空行直接返回
      if (!trimmedLine) return '';

      // 检查是否应该减少缩进级别
      if (
        trimmedLine.startsWith('}') ||
        trimmedLine.startsWith(')') ||
        trimmedLine.startsWith(']') ||
        trimmedLine.endsWith('</')
      ) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // 添加缩进
      const indent = indentChar.repeat(tabSize * indentLevel);
      const formattedLine = indent + trimmedLine;

      // 检查是否应该增加缩进级别
      if (
        trimmedLine.endsWith('{') ||
        trimmedLine.endsWith('(') ||
        trimmedLine.endsWith('[') ||
        (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</'))
      ) {
        indentLevel++;
      }

      return formattedLine;
    });

    return formattedLines.join('\n');
  } catch (error) {
    console.error('Indentation format error:', error);
    return code;
  }
};

// 复制代码
const copyCode = () => {
  if (props.disabled) return;

  try {
    // 直接使用当前组件绑定的代码值
    const currentCode = code.value;
    if (!currentCode) return;

    navigator.clipboard
      .writeText(currentCode)
      .then(() => {
        ElMessage.success('代码已复制到剪贴板');
      })
      .catch(error => {
        console.error('Copy code error:', error);
        ElMessage.error('复制失败');
      });
  } catch (error) {
    console.error('Copy code error:', error);
    ElMessage.error('复制失败');
  }
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 监听属性变化
watch(
  () => props.value,
  newValue => {
    if (newValue !== code.value) {
      code.value = newValue;
    }
  }
);

watch(
  () => code.value,
  newValue => {
    emit('update:value', newValue);
  }
);

watch(
  () => props.language,
  newValue => {
    currentLanguage.value = newValue;
  }
);

watch(
  () => props.theme,
  newValue => {
    currentTheme.value = newValue;
  }
);

// 暴露方法给父组件
defineExpose({
  formatCode,
  copyCode,
  getEditor: () => cmEditor.value,
});
</script>

<style lang="scss" scoped>
.code-editor-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: var(--el-bg-color);
    border-radius: 0;
  }

  .code-editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background-color: var(--el-bg-color-secondary);
    border-bottom: 1px solid var(--el-border-color);

    .left-actions,
    .right-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .el-select {
      width: 120px;
    }
  }

  .code-editor-content {
    flex: 1;
    overflow: auto;

    :deep(.cm-editor) {
      height: 100%;
    }

    :deep(.CodeMirror) {
      height: 100%;
      font-family: Menlo, Monaco, 'Courier New', monospace;
    }
  }
}
</style>
