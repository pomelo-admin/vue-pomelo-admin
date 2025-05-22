import type { App } from 'vue';
import { permission, role } from './permission';

export default {
  install(app: App) {
    // 注册权限指令
    app.directive('permission', permission);
    app.directive('role', role);
  },
};
