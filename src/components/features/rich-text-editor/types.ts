/**
 * 富文本编辑器属性接口
 */
export interface RichTextEditorProps {
  /**
   * 编辑器内容，支持双向绑定
   */
  modelValue?: string;

  /**
   * 编辑器高度
   */
  height?: string;

  /**
   * 编辑器最大高度，超出则显示滚动条
   */
  maxHeight?: string;

  /**
   * 编辑器宽度
   */
  width?: string;

  /**
   * 占位文本
   */
  placeholder?: string;

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 工具栏配置，传入空数组则不显示工具栏
   */
  toolbarKeys?: string[];

  /**
   * 是否显示工具栏
   */
  showToolbar?: boolean;

  /**
   * 编辑器模式
   * default: 默认模式，带工具栏
   * simple: 简洁模式，不带工具栏
   */
  mode?: 'default' | 'simple';
}

/**
 * 富文本编辑器事件接口
 */
export interface RichTextEditorEmits {
  /**
   * 更新modelValue
   */
  (e: 'update:modelValue', value: string): void;

  /**
   * 编辑器内容变化
   */
  (e: 'change', value: string): void;

  /**
   * 编辑器创建完成
   */
  (e: 'created'): void;

  /**
   * 编辑器销毁
   */
  (e: 'destroyed'): void;

  /**
   * 编辑器获取焦点
   */
  (e: 'focus'): void;

  /**
   * 编辑器失去焦点
   */
  (e: 'blur'): void;
}

/**
 * 编辑器实例类型
 */
export type EditorType = {
  destroy: () => void;
  getHtml: () => string;
  getText: () => string;
  getConfig: () => Record<string, any>;
  setHtml: (html: string) => void;
  focus: () => void;
  blur: () => void;
  [key: string]: any;
};
