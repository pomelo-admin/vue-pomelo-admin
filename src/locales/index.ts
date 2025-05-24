import { createI18n } from 'vue-i18n';
import type { DefineLocaleMessage } from 'vue-i18n';
import { load } from 'js-yaml';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';

// 导入YAML文件
// @ts-ignore - 忽略类型错误，因为Vite会处理这些导入
import zhCNYaml from './zh-CN.yaml?raw';
// @ts-ignore
import enUSYaml from './en-US.yaml?raw';

// 解析YAML文件并添加类型断言
const zhCN = load(zhCNYaml) as DefineLocaleMessage;
const enUS = load(enUSYaml) as DefineLocaleMessage;

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

// 获取本地存储的语言设置或使用浏览器语言
const getLanguage = () => {
  const cachedLang = localStorage.getItem('language');
  return cachedLang || 'zh-CN'; // 默认使用中文
};

// 当前语言
const currentLocale = getLanguage();

// Element Plus 语言配置
export const elementLocale = currentLocale === 'zh-CN' ? zhCn : en;

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: currentLocale,
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
});

export default i18n;
