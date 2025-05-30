import type { App } from 'vue';
import { permission, role } from './permission';
import watermark from './watermark';

export default {
  install(app: App) {
    // 注册权限指令
    app.directive('permission', permission);
    app.directive('role', role);
    // 注册水印指令
    app.directive('watermark', watermark);
  },
};
