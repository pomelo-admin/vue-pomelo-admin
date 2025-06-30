/**
 * 代码编辑器属性接口
 */
export interface CodeEditorProps {
  /**
   * 编辑器内容，支持双向绑定
   */
  value?: string;

  /**
   * 代码语言
   */
  language?: string;

  /**
   * 编辑器主题
   */
  theme?: string;

  /**
   * 编辑器高度
   */
  height?: string;

  /**
   * 编辑器宽度
   */
  width?: string;

  /**
   * 字体大小
   */
  fontSize?: number;

  /**
   * 是否显示行号
   */
  lineNumbers?: boolean;

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否自动换行
   */
  lineWrapping?: boolean;

  /**
   * Tab 大小
   */
  tabSize?: number;

  /**
   * 是否显示工具栏
   */
  showToolbar?: boolean;

  /**
   * 占位文本
   */
  placeholder?: string;
}

/**
 * 代码编辑器事件接口
 */
export interface CodeEditorEmits {
  /**
   * 更新 value
   */
  (e: 'update:value', value: string): void;

  /**
   * 编辑器内容变化
   */
  (e: 'change', value: string): void;

  /**
   * 编辑器获取焦点
   */
  (e: 'focus'): void;

  /**
   * 编辑器失去焦点
   */
  (e: 'blur'): void;

  /**
   * 编辑器格式化代码
   */
  (e: 'format', value: string): void;

  /**
   * 编辑器保存代码
   */
  (e: 'save', value: string): void;

  /**
   * 编辑器就绪
   */
  (e: 'ready', editor: any): void;
}
