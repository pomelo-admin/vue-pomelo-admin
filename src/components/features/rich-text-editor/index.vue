<template>
  <div class="rich-text-editor" :style="editorStyle">
    <div class="editor-container">
      <Toolbar
        v-if="props.showToolbar && props.mode === 'default' && !props.readonly && !props.disabled"
        class="editor-toolbar"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="props.mode"
      />
      <Editor
        class="editor-content"
        :defaultConfig="editorConfig"
        :mode="props.mode"
        :value="editorRef"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, watch, computed, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { i18nChangeLanguage } from '@wangeditor/editor';
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { useI18n } from 'vue-i18n';
import type { RichTextEditorProps, RichTextEditorEmits, EditorType } from './types';

// 引入编辑器样式
import '@wangeditor/editor/dist/css/style.css';

// 最小安全高度（像素）- 低于这个高度会导致modal和hoverbar定位异常
const MIN_SAFE_HEIGHT = 300;

// 工具栏高度（像素）
const TOOLBAR_HEIGHT = 40;

// 定义组件属性
const props = withDefaults(defineProps<RichTextEditorProps>(), {
  modelValue: '',
  // 默认高度需要加上工具栏高度，确保编辑区域满足最小安全高度
  height: `${MIN_SAFE_HEIGHT + TOOLBAR_HEIGHT}px`,
  maxHeight: '500px',
  width: '100%',
  placeholder: '请输入内容...',
  readonly: false,
  disabled: false,
  toolbarKeys: () => [], // 默认使用完整工具栏配置
  showToolbar: true,
  mode: 'default',
});

// 定义组件事件
const emit = defineEmits<RichTextEditorEmits>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<EditorType>();

// 编辑器内容
const valueHtml = ref(props.modelValue || '');

// 国际化
const { locale } = useI18n();

// 检查高度是否符合最小要求
onMounted(() => {
  // 确保编辑器容器高度正确
  setTimeout(() => {
    const editorContainer = document.querySelector('.w-e-scroll');
    if (editorContainer && editorContainer instanceof HTMLElement) {
      // 计算编辑区域的最小高度（考虑工具栏）
      const minContentHeight =
        props.readonly || props.disabled || props.mode === 'simple' || !props.showToolbar
          ? MIN_SAFE_HEIGHT
          : MIN_SAFE_HEIGHT;

      if (editorContainer.clientHeight < minContentHeight) {
        editorContainer.style.minHeight = `${minContentHeight}px`;
      }
    }
  }, 100);
});

// 解析高度值，返回数字（像素）
const parseHeightValue = (height: string): number => {
  if (height.endsWith('px')) {
    return parseInt(height);
  } else if (height.endsWith('rem')) {
    return parseInt(height) * 16; // 假设 1rem = 16px
  } else if (height.endsWith('em')) {
    return parseInt(height) * 16; // 假设 1em = 16px
  } else if (height.endsWith('%')) {
    // 百分比高度无法准确计算，返回最小安全高度
    return MIN_SAFE_HEIGHT;
  } else {
    return parseInt(height) || MIN_SAFE_HEIGHT;
  }
};

// 设置编辑器语言
watch(
  () => locale.value,
  newVal => {
    if (newVal === 'en-US') {
      i18nChangeLanguage('en');
    } else {
      i18nChangeLanguage('zh-CN');
    }
  },
  { immediate: true }
);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal;
      // 更新编辑器内容
      if (editorRef.value && valueHtml.value !== editorRef.value.getHtml()) {
        editorRef.value.setHtml(valueHtml.value);
      }
    }
  }
);

// 编辑器配置
const editorConfig = computed<Partial<IEditorConfig>>(() => {
  return {
    placeholder: props.placeholder,
    readOnly: props.readonly || props.disabled,
    scroll: true,
    MENU_CONF: {},
  };
});

// 默认完整工具栏配置
const defaultFullToolbarKeys = [
  'headerSelect',
  'bold',
  'italic',
  'underline',
  'through',
  'color',
  'bgColor',
  'fontSize',
  'fontFamily',
  'bulletedList',
  'numberedList',
  'todo',
  'justifyLeft',
  'justifyCenter',
  'justifyRight',
  'insertLink',
  'insertImage',
  'insertTable',
  'codeBlock',
  'blockquote',
  'divider',
  'undo',
  'redo',
];

// 工具栏配置
const toolbarConfig = computed(() => {
  return {
    toolbarKeys: props.toolbarKeys.length > 0 ? props.toolbarKeys : defaultFullToolbarKeys,
  };
});

// 编辑器样式
const editorStyle = computed(() => {
  // 解析用户设置的高度值
  let height = props.height;
  const heightValue = parseHeightValue(height);

  // 计算编辑区域需要的最小高度（考虑工具栏）
  const minEditorHeight =
    props.readonly || props.disabled || props.mode === 'simple' || !props.showToolbar
      ? MIN_SAFE_HEIGHT
      : MIN_SAFE_HEIGHT + TOOLBAR_HEIGHT;

  // 如果高度小于最小所需高度，调整高度
  if (heightValue < minEditorHeight) {
    height = `${minEditorHeight}px`;
  }

  return {
    width: props.width,
    height: height,
    maxHeight: props.maxHeight,
    minHeight: `${minEditorHeight}px`, // 添加最小高度限制
  };
});

// 编辑器创建完成时的回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  // 初始化内容
  if (valueHtml.value) {
    editor.setHtml(valueHtml.value);
  }

  // 确保编辑区域高度不小于最小安全高度
  const editorDom = editor.getEditableContainer();
  if (editorDom && editorDom instanceof HTMLElement) {
    editorDom.style.minHeight = `${MIN_SAFE_HEIGHT}px`;
  }

  emit('created');
};

// 编辑器内容变化时的回调
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml();
  valueHtml.value = html;
  emit('update:modelValue', html);
  emit('change', html);
};

// 编辑器销毁时的回调
const handleDestroyed = () => {
  emit('destroyed');
};

// 编辑器获取焦点时的回调
const handleFocus = () => {
  emit('focus');
};

// 编辑器失去焦点时的回调
const handleBlur = () => {
  emit('blur');
};

// 组件销毁前，销毁编辑器实例
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});

// 暴露编辑器实例，方便父组件调用
defineExpose({
  editor: editorRef,
});
</script>

<style lang="scss" scoped>
.rich-text-editor {
  min-height: v-bind('editorStyle.minHeight');
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: v-bind('editorStyle.minHeight');

    .editor-toolbar {
      height: v-bind('`${TOOLBAR_HEIGHT}px`');
      background-color: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color);
    }

    .editor-content {
      flex: 1;
      min-height: v-bind('`${MIN_SAFE_HEIGHT}px`');
      overflow-y: auto;
      background-color: var(--el-bg-color-page);
    }
  }

  &:deep(.w-e-text-container) {
    height: v-bind(
      'props.readonly || props.disabled || props.mode === "simple" || !props.showToolbar ? "100%" : `calc(100% - ${TOOLBAR_HEIGHT}px)`'
    ) !important;
    min-height: v-bind('`${MIN_SAFE_HEIGHT}px`') !important;
    border: none !important;
  }

  &:deep(.w-e-scroll) {
    min-height: v-bind('`${MIN_SAFE_HEIGHT}px`') !important;
  }

  &:deep(.w-e-toolbar) {
    border: none !important;
  }
}
</style>
