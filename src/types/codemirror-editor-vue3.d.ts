declare module 'codemirror-editor-vue3' {
  import { DefineComponent } from 'vue';

  export const Codemirror: DefineComponent<{
    value?: string;
    options?: Record<string, any>;
    height?: string | number;
    width?: string | number;
    border?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }, {}, any>;
} 