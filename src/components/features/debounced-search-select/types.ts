/**
 * 选项项接口
 */
export interface OptionItem {
  [key: string]: any;
  disabled?: boolean;
}

/**
 * 防抖搜索选择框属性接口
 */
export interface DebouncedSearchSelectProps {
  /**
   * 绑定值，单选时为单个值，多选时为数组
   */
  modelValue?: any | any[];

  /**
   * 占位文本
   */
  placeholder?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否多选
   */
  multiple?: boolean;

  /**
   * 是否可清空
   */
  clearable?: boolean;

  /**
   * 选项中值的键名
   */
  valueKey?: string;

  /**
   * 选项中标签的键名
   */
  labelKey?: string;

  /**
   * 无数据时显示的文本
   */
  noDataText?: string;

  /**
   * 无匹配数据时显示的文本
   */
  noMatchText?: string;

  /**
   * 多选时是否保留搜索关键词
   */
  reserveKeyword?: boolean;

  /**
   * 防抖等待时间，单位毫秒
   */
  debounceWait?: number;

  /**
   * 是否使用自定义选项渲染，如果为true，需要通过slot自定义选项
   */
  customOptions?: boolean;

  /**
   * 远程搜索数据的方法
   * @param query 搜索关键词
   * @returns 返回选项数组的Promise
   */
  fetchOptions?: (query: string) => Promise<OptionItem[]>;

  /**
   * 根据值列表获取选项详情的方法
   * @param values 值列表
   * @returns 返回选项数组的Promise
   */
  loadByValues?: (values: any[]) => Promise<OptionItem[]>;

  /**
   * 是否加载默认选项（当下拉框打开且没有搜索词时）
   */
  loadDefaultOptions?: boolean;
}

/**
 * 防抖搜索选择框事件接口
 */
export interface DebouncedSearchSelectEmits {
  /**
   * 更新modelValue
   */
  (e: 'update:modelValue', value: any): void;

  /**
   * 选择值变化
   */
  (e: 'change', value: any): void;

  /**
   * 下拉框显示状态变化
   */
  (e: 'visible-change', visible: boolean): void;

  /**
   * 清除选择
   */
  (e: 'clear'): void;

  /**
   * 移除标签（多选模式）
   */
  (e: 'remove-tag', value: any): void;
}
