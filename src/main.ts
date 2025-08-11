import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// Enable Element Plus dark theme CSS variables
import 'element-plus/theme-chalk/dark/css-vars.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './styles/index.scss';
import i18n from './locales';
import directives from './directives';
// Element Plus语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';

// 在生产环境中启用 mock 服务
import { setupProdMockServer } from '../mock/mockProdServer';

if (import.meta.env.PROD) {
  setupProdMockServer();
}

const app = createApp(App);

// 先挂载 Pinia，初始化主题（同步导入，减少首屏竞态/闪烁）
app.use(store);
import { useThemeStore } from '@/store/modules/theme';
useThemeStore().init();

// 获取当前语言
const currentLanguage = localStorage.getItem('language') || 'zh-CN';

// 根据当前语言选择Element Plus的语言包
const elementLocale = currentLanguage === 'zh-CN' ? zhCn : en;

// 注册所有 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 配置Element Plus，应用当前语言
app
  .use(store)
  .use(router)
  .use(ElementPlus, {
    locale: elementLocale,
  })
  .use(i18n)
  .use(directives)
  .mount('#app');
