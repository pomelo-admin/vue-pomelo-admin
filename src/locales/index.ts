import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN';
import enUS from './en-US';

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

// 获取本地存储的语言设置或使用浏览器语言
const getLanguage = () => {
  const cachedLang = localStorage.getItem('language');
  return cachedLang || 'zh-CN'; // 默认使用中文
};

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getLanguage(),
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
});

export default i18n;
